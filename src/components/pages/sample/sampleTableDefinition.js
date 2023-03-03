export const sampleTableDefinition = {
  columns: [
    {
      ratio:'1',
      name:'Image',
      isSort: false,
      show:false
    },
    {
      ratio:'2',
      name: 'Title',
      path: 'description',
      isSort: true,
      show: true
    },
    {
      ratio:'2',
      name: 'Genre',
      path: 'tag',
      isSort: true,
      show: true
    },
    {
      ratio:'1',
      name: 'BPM',
      path: 'bpm',
      isSort: true,
      show: true
    },
    {
      ratio:'1',
      name: 'Cost',
      path: 'cost',
      isSort: false,
      show: true
    },
    {
      ratio:'1',
      name: 'Buy',
      isSort: false,
      show: false
    }
  ].map((col, id) => ({...col, id}))
}

export default {
  sampleTableDefinition
}