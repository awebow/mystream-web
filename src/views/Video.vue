<template>
  <div class="video-page-wrapper">
    <main>
      <article class="video-article" v-if="video != null">
        <div class="in-encoding" v-if="video.status == 'ENCODING'">
          <div class="content">
            <div class="loading-circle"></div>
            <span>동영상 인코딩 중입니다.</span>
          </div>
        </div>
        <Player :src="videoUrl()" class="video-component" v-else />
        <div class="bottom-content">
          <header>
            <div class="meta">
              <img :src="channelPicture()" class="channel-picture" />
              <div class="video-info">
                <h1>{{ video.title }}</h1>
                <address class="channel-name">{{ video.channel.name }}</address>
                <time :datetime="video.posted_at">{{ linguisticTime(video.posted_at) }}</time>
              </div>
              <template v-if="!ownership && subscription">
                <button type="button" class="subscribe" v-if="!subscription.subscribed" @click="subscribe">구독하기</button>
                <button type="button" class="unsubscribe" v-else @click="unsubscribe">구독취소</button>
              </template>
            </div>
            <div class="icons">
              <button type="button" class="share" @click="() => shareVisibility = true">
                <ion-icon name="share"></ion-icon>
                <div class="label">공유</div>
              </button>
              <button type="button" class="like"
                :class="{'active': expression.my_expression == 'LIKE'}"
                @click="() => expression.my_expression == 'LIKE' ? deleteExpression() : setExpression('LIKE')">
                <ion-icon name="thumbs-up"></ion-icon>
                <div class="label">{{ nums.briefNumber(expression.likes) }}</div>
              </button>
              <button type="button" class="dislike"
                :class="{'active': expression.my_expression == 'DISLIKE'}"
                @click="() => expression.my_expression == 'DISLIKE' ? deleteExpression() : setExpression('DISLIKE')">
                <ion-icon name="thumbs-down"></ion-icon>
                <div class="label">{{ nums.briefNumber(expression.dislikes) }}</div>
              </button>
            </div>
          </header>

          <main>
            <p v-for="s in sentences(this.video.description)">{{ s }}</p>
          </main>

          <footer>
            <div class="comment-form">
              <textarea :disabled="$root.me == null" v-model="postingComment" rows="1"
                :placeholder="$root.me ? '댓글 입력' : '댓글을 입력하려면 로그인해주세요.'"></textarea>
              <button type="button" @click="postComment" v-if="$root.me">등록</button>
            </div>

            <section class="comments">
              <article v-for="c in comments">
                <img :src="picture.userPicture(c.writer.picture)" />
                <div>
                  <address class="writer-name">{{ c.writer.name }}</address>
                  <time :datetime="c.posted_at">{{ linguisticTime(c.posted_at) }}</time>
                  <p v-for="s in sentences(c.content)">{{ s }}</p>
                </div>

                <button type="button" class="delete-comment" v-if="$root.me && c.writer.id == $root.me.id"
                  @click="() => deletingComment = c">
                  <ion-icon name="trash-outline"></ion-icon>
                </button>
              </article>
            </section>
          </footer>
        </div>
      </article>
    </main>

    <aside class="recommend-videos"></aside>
    <Modal
      title="댓글 삭제"
      :buttons="[
        {label: '삭제', onClick: deleteComment, closeAfter: true},
        {label: '취소', closeAfter: true}
      ]"
      :onClose="() => deletingComment = null"
      v-if="deletingComment != null">정말로 댓글을 삭제하시겠습니까?</Modal>
    
    <Modal
      class="share-modal"
      title="동영상 공유"
      :buttons="[{label: '닫기', closeAfter: true}]"
      :onClose="() => shareVisibility = false"
      v-if="video != null && shareVisibility">
      <h2>링크 공유</h2>
      <div class="copiable">
        {{ site.pathToURL(`/videos/${video.id}`) }}
      </div>
      <div class="copy">
        <a href="javascript:void(0)" v-if="!linkCopied" @click="copyLink">복사</a>
        <template v-else>복사되었습니다!</template>
      </div>

      <h2>동영상 삽입</h2>
      <div v-html="embedCode()"></div>
      <div class="copiable">{{ embedCode() }}</div>
      <div class="copy">
        <a href="javascript:void(0)" v-if="!embedCopied" @click="copyEmbed">복사</a>
        <template v-else>복사되었습니다!</template>
      </div>
    </Modal>
  </div>
</template>

<script>
import storage from '../utils/storage';
import Socket from '../utils/websocket';
import Player from '@/components/Player';
import Modal from '@/components/Modal';
import api from '../utils/api';
import time from '../utils/time';
import default_pic_ch from '@/assets/default_pic_ch.svg';
import picture from '../utils/picture';
import Cookies from 'js-cookie';
import nums from '../utils/nums';
import scrolls from '../utils/scrolls';
import autosize from "autosize";
import site from "../utils/site";

export default {

  data: () => ({
    video: null,
    comments: [],
    pagination: '',
    scrollHandler: null,
    socket: null,
    ownership: false,
    subscription: null,
    expression: {
      my_expression: null,
      likes: 0,
      dislikes: 0
    },
    updatingExp: false,
    deletingComment: null,
    postingComment: "",
    shareVisibility: false,
    linkCopied: false,
    embedCopied: false
  }),

  components: { Player, Modal },

  setup(props) {
    return {
      picture,
      storage,
      nums,
      site
    }
  },

  mounted() {
    api.get(`/videos/${this.$route.params.id}`).then(res => {
      var video = res.data;
      document.title = `${video.title} - ${process.env.VUE_APP_TITLE}`;

      api.get(`/channels/${video.channel_id}`).then(res => {
        delete video.channel_id;
        video.channel = res.data;

        if(video.status == 'ENCODING') {
          this.socket = new Socket(process.env.VUE_APP_NOTIFICATION_WS_URL +
            "?authorization=" + encodeURIComponent(Cookies.get("Authorization")));
          this.socket.on('ready', data => {
            this.socket.emit('join', `video/${this.$route.params.id}/encode`);
          });
          this.socket.on('encoded', data => {
            delete data.channel_id;
            data.channel = this.video.channel;
            this.video = data;
            this.socket.close();
          });
        }

        api.get(`/channels/${video.channel.id}/permissions`).then(res => {
          this.ownership = res.data.ownership;

          api.get(`/channels/${video.channel.id}/subscriptions`)
            .then(res => this.subscription = res.data);
        });

        this.video = video;
        this.$nextTick(() => autosize(this.$el.querySelector("textarea")));
      });
    });

    api.get(`/videos/${this.$route.params.id}/expressions`).then(res => {
      this.expression = res.data;
    });
    
    this.fetchComment().then(() => {
      if(this.pagination) {
        this.scrollHandler = scrolls.nearBottom(this.fetchComment);
        this.scrollHandler.enable();
      }
    });
  },

  beforeUnmount() {
    autosize.destroy(this.$el.querySelector("textarea"));
  },

  unmounted() {
    if(this.scrollHandler)
      this.scrollHandler.disable();
  },

  methods: {
    videoUrl() {
      return storage.videoUrl(`/${this.$route.params.id}/video.mpd`);
    },

    channelPicture() {
      var picture = this.video.channel.picture;
      return picture == null ? default_pic_ch : storage.imageUrl(`/${picture}/512x512.jpg`);
    },

    sentences(s) {
      return s.split('\n');
    },

    linguisticTime: date => date == null ? '게시 안됨' : time.linguistic(date),

    async getWriter(c) {
      c.writer = (await api.get(`/users/${c.writer_id}`)).data;
      delete c.writer_id;
    },

    setExpression(type) {
      if(this.updatingExp)
        return;

      this.updatingExp = true;
      api.put(`/videos/${this.$route.params.id}/expressions`,
        {type}).then(res => this.expression = res.data)
        .finally(() => this.updatingExp = false);
    },

    deleteExpression() {
      if(this.updatingExp)
        return;

      this.updatingExp = true;

      api.delete(`/videos/${this.$route.params.id}/expressions`)
        .then(res => this.expression = res.data)
        .finally(() => this.updatingExp = false);
    },

    async fetchComment() {
      try {
        let res = await api.get(`/videos/${this.$route.params.id}/comments?` + new URLSearchParams({
          pagination: this.pagination
        }));

        for(var c of res.data.data) {
          await this.getWriter(c);
        }

        this.comments = this.comments.concat(res.data.data);
        this.pagination = res.data.pagination;

        if(this.pagination && this.scrollHandler)
          this.scrollHandler.disable();
      }
      catch(e) { }
    },

    postComment() {
      api.post(`/comments`, {
        video_id: this.$route.params.id,
        content: this.postingComment
      }).then(async res => {
        var comment = res.data;
        await this.getWriter(comment);

        this.comments.unshift(comment);
        this.postingComment = "";
        this.$nextTick(() => autosize.update(this.$el.querySelector("textarea")));
      });
    },

    deleteComment() {
      api.delete(`/comments/${this.deletingComment.id}`).then(() => {
        for(var i in this.comments) {
          if(this.deletingComment == this.comments[i]) {
            this.comments.splice(i, 1);
            break;
          }
        }
      });
    },

    subscribe() {
      api.post(`/channels/${this.video.channel.id}/subscriptions`, null)
        .then(res => this.subscription = res.data);
    },

    unsubscribe() {
      api.delete(`/channels/${this.video.channel.id}/subscriptions`)
        .then(res => this.subscription = res.data);
    },

    copyLink() {
      navigator.clipboard.writeText(site.pathToURL(`/videos/${this.video.id}`));
      this.linkCopied = true;
      setTimeout(() => this.linkCopied = false, 2000)
    },

    copyEmbed() {
      navigator.clipboard.writeText(this.embedCode());
      this.embedCopied = true;
      setTimeout(() => this.embedCopied = false, 2000)
    },

    embedCode() {
      var width = 640;
      var height = this.video.width >= this.video.height
        ? Math.floor(this.video.height * width / this.video.width)
        : 360;
      
      return `<iframe width="${width}" height="${height}" ` +
          `src="${site.pathToURL(`/embedded/${this.video.id}`)}" ` +
          `frameborder="0" allowfullscreen></iframe>`;
    }
  }
}
</script>

<style lang="scss">
  @import "../stylesheets/colors.scss";
  @import "../stylesheets/dimensions.scss";

  .video-page-wrapper {
    display: flex;
    flex: 1;

    main {
      flex: 0 0 calc(100vw - 512px);
    }
  }

  .video-article {
    $picture-size: 55px;
    $header-gap: 12px;

    .video-component:not(:fullscreen) {
      max-height: calc(100vh - #{$top-bar-height});
    }

    .bottom-content {
      padding: 0 16px;

      header {
        .meta {
          display: flex;
          margin: 16px 0 8px 0;
          align-items: center;

          .channel-picture {
            height: $picture-size;
            border-radius: $picture-size / 2;
            margin-right: $header-gap;
          }

          h1 {
            margin: 0;
            font-size: 20px;
            line-height: 20px;
          }

          time {
            color: $text-dark-grey;
            font-size: 14px;
            line-height: 100%;
            display: block;
          }

          .channel-name {
            color: $text-dark-grey;
            font-style: normal;
            font-size: 15px;
          }

          .video-info {
            flex: 1;
          }

          .subscribe, .unsubscribe {
            display: block;
            height: 32px;
            background-color: $theme-blue;
            line-height: 32px;
            text-align: center;
            border: none;
            outline: none;
            cursor: pointer;
            border-radius: 4px;
            padding: 0 8px;
            font-size: 15px;

            color: white;
            text-decoration: none;
          }
        }

        .icons {
          display: flex;
          justify-content: flex-end;
          gap: 12px;

          button {
            height: 36px;
            display: flex;
            align-items: center;
            gap: 8px;

            background: none;
            border: none;
            outline: none;
            cursor: pointer;

            font-size: 24px;
            color: $text-dark-grey;

            .label {
              font-size: 14px;
            }

            &.active {
              color: $theme-blue-emp;
            }
          }

          .share ion-icon {
            margin-bottom: 5px;
          }

          .like {
            ion-icon {
              margin-bottom: 6px;
            }
          }

          .dislike {
            ion-icon {
              margin-top: 2px;
            }
          }
        }
      }

      main {
        margin-left: $picture-size + $header-gap;
        font-size: 14px;

         p {
          text-align: justify;
          margin: 0;
        }
      }
    }

    footer {
      margin-top: 16px;
    }

    .comment-form {
      background: white;
      border: 1px solid #c7c7c7;
      border-radius: 18px;
      display: flex;
      align-items: flex-end;

      textarea {
        box-sizing: border-box;
        font-size: 14px;
        line-height: 22px;
        padding: 6px 12px;
        outline: none;
        flex: 1;
        border: none;
        background: none;
        outline: none;
        min-height: 36px;
        resize: none;
        //line-break: auto;
        word-wrap: break-word;
        overflow-wrap: break-word;
      }

      button {
        box-sizing: border-box;
        display: block;
        background: $theme-blue;
        border: none;
        outline: none;
        color: white;
        width: 40px;
        height: 24px;
        border-radius: 12px;
        padding: 0;
        margin-right: 8px;
        margin-bottom: 5px;

        font-family: inherit;
        font-size: 14px;
        cursor: pointer;
      }
    }

    .comments {
      article {
        display: flex;
        margin: 16px 0;
        position: relative;

        img {
          display: block;
          height: 48px;
          border-radius: 24px;
        }

        div {
          margin-left: 12px;
        }

        .writer-name {
          font-style: normal;
          font-weight: bold;
          font-size: 15px;
          line-height: 100%;
        }

        time {
          font-size: 14px;
          color: $text-dark-grey;
          display: block;
        }

        p {
          margin: 0;
          font-size: 14px;
        }

        .delete-comment {
          background: none;
          border: none;
          outline: none;
          position: absolute;
          top: 8px;
          right: 0;

          font-size: 16px;
          color: $text-dark-grey;
          cursor: pointer;
        }
      }
    }

    .in-encoding {
      background: black;
      width: 100%;
      padding-top: 56.25%;
      position: relative;

      .content {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 12px;

        color: white;

        .loading-circle {
          box-sizing: border-box;
          width: 36px;
          height: 36px;
          border: 6px solid #3f3f3f;
          border-top-color: #979797;
          border-radius: 18px;

          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      }
    }
  }

  .recommend-videos {
    flex: 1;
  }

  .share-modal {
    h2 {
      font-size: 16px;
      margin: 8px 0 0 0;
    }

    .copy {
      font-size: 14px;
      margin-left: 8px;
      text-align: right;
      color: $text-dark-grey;

      a {
        color: $theme-blue;
        text-decoration: none;

        &:hover {
          color: $theme-blue-emp;
        }
      }
    }

    .copiable {
      box-sizing: border-box;
      width: 640px;
      padding: 4px;
      border: 1px solid $line-grey;
      border-radius: 8px;
      background-color: #f0f0f0;
      font-size: 14px;
      clear: both;
    }
  }
</style>