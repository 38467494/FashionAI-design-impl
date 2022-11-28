import axios from "../api/http";
// axios.defaults.timeout = 1000 * 75; // 75s, bag & shoe需要约4s；upper需要约60s；bottom需要约30s
const address = 'http://10.249.176.82:8888/recommendation'
// const address = 'http://localhost:8888/recommendation'
/**
 * 查询所有品牌记录
 * @returns brands[]
 */
export const getBrandList = params =>
  axios.get(address + '/get-brand-list', params);
/**
 * 根据id列表删除品牌记录
 * @param {ids} formData
 * @returns
 */
export const deleteBrands = formData =>
  axios.post(address + '/delete-brands', formData);
/**
 * 根据id列表还原品牌记录
 * @param {ids} formData
 * @returns
 */
export const recoverBrands = formData =>
  axios.post(address + '/recover-brands', formData);

/**
 * 新增/更新一条品牌记录
 * @param {} formData
 * @returns
 */
export const saveBrand = formData =>
  axios.post(address + '/save-brand', formData);
/**
 * 根据id列表查询品牌记录
 * @param {*} params
 * @returns
 */
export const getBrandByIds = params =>
  axios.get(address + '/get-brand-by-ids', params);



/**
 * 查询所有分类记录
 * @returns categories
 */
export const getCategoryList = params =>
  axios.get(address + '/get-category-list', params);

export const deleteCategories = formData =>
  axios.post(address + '/delete-categories', formData);

export const recoverCategories = formData =>
  axios.post(address + '/recover-categories', formData);

export const getCategoryByIds = params =>
  axios.get(address + '/get-category-by-ids', params);

export const saveCategory = formData =>
  axios.post(address + '/save-category', formData);

export const getCategoryByRecType = params =>
  axios.get(address + '/get-category-by-rec-type', params);



/**
 *
 * @param {categoryIds, brandIds, currentPage, pageSize} params 其中categoryIds和brandIds可以不传入，则不限制该条件
 * @returns
 */
export const getMaterialPage = params =>
  axios.get(address + '/get-material-page', params);

/**
 * 根据id列表查询素材列表
 * @param {*} params: ids, status
 * @returns materials[]
 */
export const getMaterialByIds = params =>
  axios.get(address + '/get-material-by-ids', params);
/**
 *
 * @param {ids} formData
 * @returns
 */
export const deleteMaterials = formData =>
  axios.post(address + '/delete-materials', formData);

export const recoverMaterials = formData =>
  axios.post(address + '/recover-materials', formData);

export const saveMaterial = formData =>
  axios.post(address + '/save-material', formData);




export const saveSuit = formData =>
  axios.post(address + '/save-suit', formData);



export const updateSuit = formData =>
  axios.post(address + '/update-suit', formData);

export const auditSuits = formData =>
  axios.post(address + '/audit-suits', formData)
  /**
   * 根据id列表批量软删除套装
   * @param {ids} formData
   * @returns
   */
export const deleteSuits = formData =>
  axios.post(address + '/delete-suits', formData);
/**
 * 根据id列表批量还原套装
 * @param {ids} formData
 * @returns
 */
export const recoverSuits = formData =>
  axios.post(address + '/recover-suits', formData);

export const getSuitPage = params =>
  axios.get(address + '/get-suit-page', params);

export const getSuitByIds = params =>
  axios.get(address + '/get-suit-by-ids', params);

/**
 *
 * @param {*} formData {ids, customerId}
 * @returns
 */
export const deleteDrafts = formData =>
  axios.post(address + '/delete-drafts', formData);


export const getRecommendationList = params =>
  axios.get(address + '/get-recommendation-list', params);
