angular.module('app').service('usersAPI', function($http){
  this.getUsers = function(busca){
    return $http({
        method: 'GET',
        url: "https://api.github.com/search/users?page=1&per_page=100&q=fullname:%3A" + busca, 
        headers: {
            'Accept': 'application/vnd.github.v3.text-match+json'
        }
    })
  }
  
  this.getUser = function(loginUser){
    return $http({
        method: 'GET',
        url: "https://api.github.com/users/" + loginUser
    })
  }
})
