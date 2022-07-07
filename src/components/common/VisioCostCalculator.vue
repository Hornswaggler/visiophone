<template>
  <div>
    Tokens: {{ tokens }} <br />
    Dollars: ${{ tokens * rate }} <br />
    Terrabyte Cost: ${{ terrabyteCost }} / 1 <br />
    User Storage Costs: {{ storageCostPerUser }}<br />
    Max Scarcity of an Item:{{ maxScarcity }}<br />
    Events / event fee: {{ 50 }} visiotokens<br />
    Event Cut: 50<br />
  </div>
</template>
<script>
export default {
  name: "VisioCostCalculator",
  data: () => ({
    tokens: 100,
    rate: 0.1,
    eventFee: 50,
    eventCut: 50,
    maxScarcity: 500,
    shelf: 100,
    terrabyte: 1000000,
    terrabyteCost: 20,
  }),
  computed: {
    storageCostPerUser() {
      return (this.terrabyteCost * this.shelf) / this.terrabyte;
    },
  },
};
</script>
