export const state = () => ({
  currentPose: null,
  poseTextStyle: null,
})

export const mutations = {
  changePose(state, pose) {
    state.currentPose = pose[0]
    state.poseTextStyle = pose[1]
  },
  removePose(state) {
    state.currentPose = null
    state.poseTextStyle = null
  },
  changeStyle(state, style) {
    state.poseTextStyle = style
  },
}
