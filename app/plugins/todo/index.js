define('Todo', function(){
  return {
    title : 'Todo', // this will shown as the menu title
    name : 'Todo', // Foundry will add an object with this name, so you can access with it.
    type : 'plugin',
    anchor : '#/Todo', // this property is for angular route
    icon : 'icon-list',
    init : function(){
      // a basic method for foundry to init your plugin
      // we will setup a model here
      var self = this;
      foundry.model('Todo', ['title','completed'], function(model){
        // this callback will return the model being created
        // then you need to make this call to tell foundery 
        // the current plugin is finished loading and ready
        foundry.initialized(self.name);
      });
    },
    inited : function(){ 
       // inited is an optinal method
       // it will be called when all other plugin is loaded
       define_controller();
    }
  } 
});

// maybe some code for angular controller
function define_controller(){
  angular.module('foundry').controller('TodoController', ['$scope', 'ngNotify', function($scope, ngNotify){
    $scope.todos = [];
    // get a reference with the model we registered above
    todo_model = foundry._models.Todo

    todo_model.onUpdate(function(mode, obj, isLocal){
      //  update todos
      $scope.load();
      if(!isLocal){
        $scope.$apply();
      }
    });

    $scope.load = function(){
        $scope.todos = todo_model.all()
    }

    $scope.add_todo = function(){
        todo_model.create({title:$scope.todo_title,completed:false});

        $scope.load();
        $scope.todo_title = '';
        // test with error
        ngNotify.set('Added a todo successfully!');
    }

    $scope.delete_todo = function(index){
        var id = $scope.todos[index].id,
            todo =todo_model.findByAttribute('id', id);

        todo.destroy();
        $scope.load();
    }

    $scope.load();
  }]);
}
