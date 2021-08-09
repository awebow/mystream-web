export default {
    videoUrl: path => process.env.VUE_APP_VIDEO_STORAGE_URL + path,
    imageUrl: path => process.env.VUE_APP_IMAGE_STORAGE_URL + path
}