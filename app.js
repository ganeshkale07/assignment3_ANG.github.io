(
    function(){

        'use strict';

        angular.module('NarrowItDownApp',[])
        .controller('NarrowItDownController', NarrowItDownController)
        .service('MenuSearchService',MenuSearchService)
        .directive('foundItems',foundItems)
        .constant('APIPath','https://davids-restaurant.herokuapp.com/');

        
        function foundItems (){
            let ddo = {
                templateUrl : 'loader/foundItems.html',
                scope :{
                    foundItem : '<',
                    onRemove : '&',
                    isListEmpty : '<'
                }
            }
            return ddo;

        }

        NarrowItDownController.$inject = ['MenuSearchService'];
        function NarrowItDownController(MenuSearchService){
            let item  = this;
            item.search = "";
            item.found = [];
            item.isListEmpty = "initial empty string";
            item.getMatchedMenuItems = function(){
                let promise = MenuSearchService.getMatchedMenuItems(item.search);
                promise.then(function(response){
                    console.log(response);
                    item.found = response;
                    item.isListEmpty = item.found.length;
                })
            }

            item.onRemove = function(del){
                item.found = MenuSearchService.removeItemFromList(del);
                console.log(item.found);
            }
        }

        MenuSearchService.$inject = ['$http','APIPath'];
        function MenuSearchService ($http, APIPath){
            let servant = this;
            var itemList = [];
            servant.getMatchedMenuItems = function(txt){
                return $http({
                    method:'GET',
                    url : APIPath + "menu_items.json" 
                    })
                    .then(function (result){
                        itemList = [];
                        for(let eachItem of result.data.menu_items){
                            if(eachItem.description.includes(txt.toLowerCase()) && txt !== ""){
                                itemList.push(eachItem);
                            }
                        }
                        return itemList; 
                    })
                    .catch(function (error) {
                        console.log("Something went terribly wrong.");
                    }); 
                        
            }

            servant.removeItemFromList = function(del){
                itemList.splice(del,1);
                return itemList;
            }

            }

 
        
    }
)();