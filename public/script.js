/*
const Watch = {
    template: "<div>Watch you are buying {{ $route.params.id }}</div>"
}

const router = new VueRouter({
  routes: [
    { path: '/watch/:id', component: Watch }
  ]
})
*/
var validWatches = ["vostokN1","vostokAmphibia","poljotOkean"];
var url = new URL(window.location);
var myWatch = url.searchParams.get("watch");

if (validWatches.indexOf(myWatch)<0){
  myWatch="vostokAmphibia";
}
console.log("Someone is looking at : " + myWatch);

var app = new Vue({
  el: '#app',
  //router,
  data: {
    //number: '',
    curWatch: {},
    loading:true,
    watchname : '',
    purchases: [],
    buyer: '',
    creditCard: ''
  },
  created: function() {
    this.watchname = myWatch;
    this.buyWatch();
  },
  computed:{
      watch:function(){
          var watch = myWatch;
          return watch;
      },
      allPurchases: function() {
        return this.purchases;
      },
      filteredPurchases: function() {
        return this.purchases.filter(function(purchase) {
          return purchase.watch===myWatch;
      })},
      grandTotal: function(){
        var t = 0;
        this.purchases.forEach(function(e){
          t += e.price;
        });
        return t;
      }

  },
  methods: {
    buyWatch: function() {
      this.loading = true;
      // Get the Watch information from the NodeJS Api
      $.getJSON('/api/watch/' + this.watchname , function(json){
        }).then(json=>{
            this.curWatch = json;
            this.loading = false;
            //console.log("Loaded");
        });
      $.getJSON('/api/purchases/' , function(json){
      }).then(json=>{
        this.purchases = json;
      });


    }, /*
    addComment: function() {
       //console.log(this.buyer + ' ' + this.creditCard);

      if (!(this.number in this.buyers))
        Vue.set(app.buyers, this.number, new Array);
      var options = {year: 'numeric', month: 'long', day: 'numeric'};
      var date = new Date();
      this.buyers[this.number].push({buyer:date.toLocaleDateString('en-US', options) +': '+ this.buyer + ' bought a ' + this.curWatch.name + ' with CC# ' + this.creditCard});
      this.buyer = '';
      this.creditCard = '';
    },*/
    addPurchase: function() {
      var options = {year: 'numeric', month: 'long', day: 'numeric'};
      var smallDateOptions = {year: 'numeric', month: 'numeric', day: 'numeric'};
      var date = new Date();
      var smallDate = date.toLocaleDateString('en-US', smallDateOptions);
      var dateString = date.toLocaleDateString('en-US', options);
      axios.post("/api/purchases", {watch:myWatch, date:smallDate,name:this.buyer,
        text: dateString +': '+ this.buyer + ' bought a ' + this.curWatch.name ,
      }).then(response => {
        this.buyer = "";
        this.creditCard = "";
        this.getPurchases();
        console.log("Just sold a " + myWatch);
        return true;
      }).catch(err => {
      });
    },
    getPurchases: function() {
      axios.get("/api/purchases").then(response => {
        this.purchases = response.data;
        return true;
      }).catch(err => {
      });
    },
    editPurchase: function(purchase) {
      axios.put("/api/purchases/" + purchase.id, {
        name: purchase.name,
      }).then(response => {
	      return true;
      }).catch(err => {
      });
    },
    cancelPurchase: function(purchase) {
      axios.delete("/api/purchases/" + purchase.id).then(response => {
        this.getPurchases();
        console.log("Refunding purchase #" + purchase.id);
        return true;
      }).catch(err => {
      });
    },
  },
});
