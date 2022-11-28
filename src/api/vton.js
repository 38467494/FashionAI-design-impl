import axios from "./http";

//10.249.176.82

export const doVirtualTryOn = (clothFileName, modelFileName) => {
  return axios.get('http://10.249.176.82:8888/vto/doVto', {
    params: {
      clothFileName: clothFileName,
      modelFileName: modelFileName
    },
    timeout: 120000
  })
}

export const doVtonInit = () => {
  return axios.get('http://10.249.176.82:8888/vto/init')
}
