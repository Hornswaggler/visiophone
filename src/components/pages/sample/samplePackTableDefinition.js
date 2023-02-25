export const samplePackTableDefinition = {
  columns:[
    {
      name: 'Image',
      path: 'imgUrl',
      isSort: false,
      show: false
    },
    {
      ratio: '1',
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
    },
    {
      ratio: '1',
      name: 'Cost',
      path: 'cost',
      isSort: true,
      show:true
    },
    {
      name: 'Purchase',
      isSort: false,
      show: false
    }
  ].map((col, _id) => ({...col, _id}))
};

export default {
  samplePackTableDefinition
}