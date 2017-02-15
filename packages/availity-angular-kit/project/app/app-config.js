export default function($urlRouterProvider, $stateProvider) {

  $stateProvider
    .state('app', {
      template: '<app></app>'
    });

  $urlRouterProvider.otherwise('/request');

}

