/**
 * Created with JetBrains WebStorm.
 * User: Rob_Weaver
 * Date: 11/20/13
 * Time: 1:04 PM
 * To change this template use File | Settings | File Templates.
 */

var app = angular.module("myapp", ["firebase"]);

app.config(function($routeProvider) {
    $routeProvider.
        when('/', {controller:'chatController', templateUrl:'views/chat.html'}).
        otherwise({redirectTo:'/'});
});


app.controller('chatController',['$scope','angularFire','$location', '$anchorScroll','angularFireAuth', function($scope, angularFire, $location, $anchorScroll, angularFireAuth){
    var ref = new Firebase("https://dat-chat1.firebaseio.com/messages");
    var username = null;
    var query = ref.limit(30);

    //$scope.messages = [];
    angularFire(ref, $scope, "messages"); //binding the model

    ref.on('child_added', function(snap){
        var name = snap.child('from').val();
        var body = snap.child('body').val();
        console.log("Something " + name + "," + body);
    });
    query.on('child_removed', function(snap){
        var dataname = snap.child('from').val();
        var datamsg = snap.child('body').val();
        //data1.remove();

        console.log("removed " + dataname +","+ datamsg);
    });

        //This will keep you at bottom of page if you are there...
    $scope.stayBottom = function(){
        $location.hash('#bottom');
        // call $anchorScroll()
        $anchorScroll();
    }

    $scope.addMessage = function(e) {
        if (e.keyCode != 13) return;
        $scope.messages.push({from: username, body: $scope.msg});
        $scope.msg = "";

        $scope.stayBottom();
    }


    //Authentication
    angularFireAuth.initialize(ref, {scope: $scope, name: "user", path: '/'});
    $scope.login = function(){
        angularFireAuth.login("facebook");
    }

    $scope.logout = function() {
        angularFireAuth.logout();
    }

    $scope.$on("angularFireAuth:login", function(evt, user) {
        // User logged in.
        console.log('Logged In: ' + user.name );
        username = user.name;
    });
    $scope.$on("angularFireAuth:logout", function(evt) {
        // User logged out.
        console.log('Logged Out');
        username = '';
    });
    $scope.$on("angularFireAuth:error", function(evt, err) {
        // There was an error during authentication.
        console.log('error' + err + ", " + evt);
    });




}]);

/*

app.controller('fullController',['$scope','angularFireAuth', function($scope, angularFireAuth){
    var ref = new Firebase("https://dat-chat1.firebaseio.com/messages");
    //var myUserID = null;
    angularFireAuth.initialize(ref, {scope: $scope, name: "user", path: '/'});

    $scope.login = function(){
        angularFireAuth.login("facebook");
    }

    $scope.logout = function() {
        angularFireAuth.logout();
    }

    $scope.$on("angularFireAuth:login", function(evt, user) {
        // User logged in.
        console.log('Logged In: ' + user.name );
        username = user.name;
    });
    $scope.$on("angularFireAuth:logout", function(evt) {
        // User logged out.
        console.log('Logged Out');
        username = '';
    });
    $scope.$on("angularFireAuth:error", function(evt, err) {
        // There was an error during authentication.
        console.log('error' + err + ", " + evt);
    });

}]);
*/