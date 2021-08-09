import default_pic_ch from '@/assets/default_pic_ch.svg';
import default_pic_user from '@/assets/default_pic_user.svg';
import storage from './storage';

export default {
    userPicture: (picture) => (picture == null ? default_pic_user : storage.imageUrl(`/${picture}/512x512.jpg`)),
    channelPicture: (picture) => (picture == null ? default_pic_ch : storage.imageUrl(`/${picture}/512x512.jpg`))
};