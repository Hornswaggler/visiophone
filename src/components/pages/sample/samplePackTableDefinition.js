export const samplePackTableDefinition = {
  columns:[
    {
      ration: '1',
      name: 'Image',
      path: 'imgUrl',
      isSort: false,
      show: false
    },
    {
      ratio: '2',
      name: 'Name',
      path: 'name',
      isSort: true,
      show:true
    },
    {
      ratio: '2',
      name: 'Description',
      path: 'description',
      isSort: true,
      show:true
    }
  ].map((col, _id) => ({...col, _id}))
};

export default {
  samplePackTableDefinition
}