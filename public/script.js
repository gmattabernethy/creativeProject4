var app = new Vue({
  el: '#app',
  data: {
    items: [],
    text: '',
    rating: '',
    show: 'all',
    drag: {},
  },
  created: function() {
    this.getItems();
  },
  computed: {
    activeItems: function() {
      return this.items.filter(function(item) {
	return !item.completed;
      });
    },
    filteredItems: function() {
      if (this.show === 'active')
	return this.items.filter(function(item) {
	  return !item.completed;
	});
      if (this.show === 'completed')
	return this.items.filter(function(item) {
	  return item.completed;
	});
      return this.items;
    },
  },
  methods: {
    addItem: function() {
      axios.post("/api/items", {
        text: this.text,
        rating: this.rating,
        completed: false
      }).then(response => {
        this.text = "";
        this.rating = "";
        this.getItems();
        return true;
      }).catch(err => {
      });
    },
    getItems: function() {
      axios.get("/api/items").then(response => {
        this.items = response.data;
        return true;
      }).catch(err => {
      });
    },
    completeItem: function(item) {
      axios.put("/api/items/" + item.id, {
        text: item.text,
        completed: !item.completed,
        orderChange: false,
      }).then(response => {
	      return true;
      }).catch(err => {
      });
    },
    deleteItem: function(item) {
      axios.delete("/api/items/" + item.id).then(response => {
        this.getItems();
        return true;
      }).catch(err => {
      });
    },
    showAll: function() {
      this.show = 'all';
    },
    showActive: function() {
      this.show = 'active';
    },
    showCompleted: function() {
      this.show = 'completed';
    },
    deleteCompleted: function() {
      this.items.forEach(item => {
      if (item.completed)
        this.deleteItem(item)
      });
    },
    sort: function () {
      
        for(var i=0; i<this.items.length; i++){
          if(this.items[i].rating === '1'){          
            this.dragItem(this.items[i]);
            this.dropItem(this.items[0]);
          }
        }

        for(var i=(this.items.length-1); i>=0; i--){
          if(this.items[i].rating === '3'){        
            this.dragItem(this.items[i]);
            this.dropItem(this.items[(this.items.length-1)]);
          }
        }
      
    },
    ratingUp: function(item){
      if(item.rating < 3)
        item.rating++;
      axios.put("/api/items/" + item.id, {
        text: item.text,
        completed: item.completed,
        rating: item.rating,
      }).then(response => {
        this.getItems();
        return true;
      }).catch(err => {
      });  
    },
    ratingDown: function(item){
      if(item.rating > 1)
        item.rating--;
      axios.put("/api/items/" + item.id, {
        text: item.text,
        completed: item.completed,
        rating: item.rating,
      }).then(response => {
        this.getItems();
        return true;
      }).catch(err => {
      });
    },
    dragItem: function(item) {
      this.drag = item;
    },
    dropItem: function(item) {
      axios.put("/api/items/" + this.drag.id, {
      text: this.drag.text,
      completed: this.drag.completed,
      rating: this.drag.rating,
      orderChange: true,
      orderTarget: item.id
      }).then(response => {
        this.drag={};
        this.getItems();
        return true;
      }).catch(err => {
      });
    },
  }
});
