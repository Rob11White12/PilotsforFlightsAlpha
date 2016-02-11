'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function() {
	// Init module configuration options
	var applicationModuleName = 'test2';
	var applicationModuleVendorDependencies = ['ngResource', 'ngCookies',  'ngAnimate',  'ngTouch',  'ngSanitize',  'ui.router', 'ui.bootstrap', 'ui.utils', 'ngFileUpload'];

	// Add a new vertical module
	var registerModule = function(moduleName, dependencies) {
		// Create angular module
		angular.module(moduleName, dependencies || []);

		// Add the module to the AngularJS configuration file
		angular.module(applicationModuleName).requires.push(moduleName);
	};

	return {
		applicationModuleName: applicationModuleName,
		applicationModuleVendorDependencies: applicationModuleVendorDependencies,
		registerModule: registerModule
	};
})();
'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider',
	function($locationProvider) {
		$locationProvider.hashPrefix('!');
	}
]);

//Then define the init function for starting up the application
angular.element(document).ready(function() {
	//Fixing facebook bug with redirect
	if (window.location.hash === '#_=_') window.location.hash = '#!';

	//Then init the app
	angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('airlineowners');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('airlines');
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('core');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('flights');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('pilots');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('stem4alls');
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('users');
'use strict';

//Setting up route
angular.module('airlineowners').config(['$stateProvider',
	function($stateProvider) {
		// Airlineowners state routing
		$stateProvider.
		state('listAirlineowners', {
			url: '/airlineowners',
			templateUrl: 'modules/airlineowners/views/list-airlineowners.client.view.html'
		}).
		state('createAirlineowner', {
			url: '/airlineowners/create',
			templateUrl: 'modules/airlineowners/views/create-airlineowner.client.view.html'
		}).
		state('viewAirlineowner', {
			url: '/airlineowners/:airlineownerId',
			templateUrl: 'modules/airlineowners/views/view-airlineowner.client.view.html'
		}).
		state('editAirlineowner', {
			url: '/airlineowners/:airlineownerId/edit',
			templateUrl: 'modules/airlineowners/views/edit-airlineowner.client.view.html'
		});
	}
]);
'use strict';

// Airlineowners controller
angular.module('airlineowners').controller('AirlineownersController', ['$scope', '$stateParams', '$location', 'Authentication', 'Airlineowners',
	function($scope, $stateParams, $location, Authentication, Airlineowners) {
		$scope.authentication = Authentication;

		// Create new Airlineowner
		$scope.create = function() {
			// Create new Airlineowner object
			var airlineowner = new Airlineowners ({
				name: this.name
			});

			// Redirect after save
			airlineowner.$save(function(response) {
				$location.path('airlineowners/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Airlineowner
		$scope.remove = function(airlineowner) {
			if ( airlineowner ) { 
				airlineowner.$remove();

				for (var i in $scope.airlineowners) {
					if ($scope.airlineowners [i] === airlineowner) {
						$scope.airlineowners.splice(i, 1);
					}
				}
			} else {
				$scope.airlineowner.$remove(function() {
					$location.path('airlineowners');
				});
			}
		};

		// Update existing Airlineowner
		$scope.update = function() {
			var airlineowner = $scope.airlineowner;

			airlineowner.$update(function() {
				$location.path('airlineowners/' + airlineowner._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Airlineowners
		$scope.find = function() {
			$scope.airlineowners = Airlineowners.query();
		};

		// Find existing Airlineowner
		$scope.findOne = function() {
			$scope.airlineowner = Airlineowners.get({ 
				airlineownerId: $stateParams.airlineownerId
			});
		};
	}
]);
'use strict';

//Airlineowners service used to communicate Airlineowners REST endpoints
angular.module('airlineowners').factory('Airlineowners', ['$resource',
	function($resource) {
		return $resource('airlineowners/:airlineownerId', { airlineownerId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
'use strict';

//Setting up route
angular.module('airlines').config(['$stateProvider',
	function($stateProvider) {
		// Airlines state routing
		$stateProvider.
		state('listAirlines', {
			url: '/airlines',
			templateUrl: 'modules/airlines/views/list-airlines.client.view.html'
		}).
		state('createAirline', {
			url: '/airlines/create',
			templateUrl: 'modules/airlines/views/create-airline.client.view.html'
		}).
		state('viewAirline', {
			url: '/airlines/:airlineId',
			templateUrl: 'modules/airlines/views/view-airline.client.view.html'
		}).
		state('editAirline', {
			url: '/airlines/:airlineId/edit',
			templateUrl: 'modules/airlines/views/edit-airline.client.view.html'
		});
	}
]);
'use strict';

// Airlines controller
angular.module('airlines').controller('AirlinesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Airlines',
	function($scope, $stateParams, $location, Authentication, Airlines) {
		$scope.authentication = Authentication;

		// Create new Airline
		$scope.create = function() {
			// Create new Airline object
			var airline = new Airlines ({
				name: this.name
			});

			// Redirect after save
			airline.$save(function(response) {
				$location.path('airlines/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Airline
		$scope.remove = function(airline) {
			if ( airline ) { 
				airline.$remove();

				for (var i in $scope.airlines) {
					if ($scope.airlines [i] === airline) {
						$scope.airlines.splice(i, 1);
					}
				}
			} else {
				$scope.airline.$remove(function() {
					$location.path('airlines');
				});
			}
		};

		// Update existing Airline
		$scope.update = function() {
			var airline = $scope.airline;

			airline.$update(function() {
				$location.path('airlines/' + airline._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Airlines
		$scope.find = function() {
			$scope.airlines = Airlines.query();
		};

		// Find existing Airline
		$scope.findOne = function() {
			$scope.airline = Airlines.get({ 
				airlineId: $stateParams.airlineId
			});
		};
	}
]);
'use strict';

//Airlines service used to communicate Airlines REST endpoints
angular.module('airlines').factory('Airlines', ['$resource',
	function($resource) {
		return $resource('airlines/:airlineId', { airlineId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		// Redirect to home view when route not found
		$urlRouterProvider.otherwise('/');

		// Home state routing
		$stateProvider.
		state('home', {
			url: '/',
			templateUrl: 'modules/core/views/home.client.view.html'
		});
	}
]);
'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', 'Menus',
	function($scope, Authentication, Menus) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');

		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});
	}
]);
'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication',
                                                   	function($scope, Authentication) {
                                                   		// This provides Authentication context.
                                                   		$scope.authentication = Authentication;
                                                   	}
                                                   ]);
'use strict';

//Menu service used for managing  menus
angular.module('core').service('Menus', [

	function() {
		// Define a set of default roles
		this.defaultRoles = ['*'];

		// Define the menus object
		this.menus = {};

		// A private function for rendering decision 
		var shouldRender = function(user) {
			if (user) {
				if (!!~this.roles.indexOf('*')) {
					return true;
				} else {
					for (var userRoleIndex in user.roles) {
						for (var roleIndex in this.roles) {
							if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
								return true;
							}
						}
					}
				}
			} else {
				return this.isPublic;
			}

			return false;
		};

		// Validate menu existance
		this.validateMenuExistance = function(menuId) {
			if (menuId && menuId.length) {
				if (this.menus[menuId]) {
					return true;
				} else {
					throw new Error('Menu does not exists');
				}
			} else {
				throw new Error('MenuId was not provided');
			}

			return false;
		};

		// Get the menu object by menu id
		this.getMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			return this.menus[menuId];
		};

		// Add new menu object by menu id
		this.addMenu = function(menuId, isPublic, roles) {
			// Create the new menu
			this.menus[menuId] = {
				isPublic: isPublic || false,
				roles: roles || this.defaultRoles,
				items: [],
				shouldRender: shouldRender
			};

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			delete this.menus[menuId];
		};

		// Add menu item object
		this.addMenuItem = function(menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Push new menu item
			this.menus[menuId].items.push({
				title: menuItemTitle,
				link: menuItemURL,
				menuItemType: menuItemType || 'item',
				menuItemClass: menuItemType,
				uiRoute: menuItemUIRoute || ('/' + menuItemURL),
				isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].isPublic : isPublic),
				roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].roles : roles),
				position: position || 0,
				items: [],
				shouldRender: shouldRender
			});

			// Return the menu object
			return this.menus[menuId];
		};

		// Add submenu item object
		this.addSubMenuItem = function(menuId, rootMenuItemURL, menuItemTitle, menuItemURL, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === rootMenuItemURL) {
					// Push new submenu item
					this.menus[menuId].items[itemIndex].items.push({
						title: menuItemTitle,
						link: menuItemURL,
						uiRoute: menuItemUIRoute || ('/' + menuItemURL),
						isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].items[itemIndex].isPublic : isPublic),
						roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].items[itemIndex].roles : roles),
						position: position || 0,
						shouldRender: shouldRender
					});
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenuItem = function(menuId, menuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === menuItemURL) {
					this.menus[menuId].items.splice(itemIndex, 1);
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeSubMenuItem = function(menuId, submenuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
					if (this.menus[menuId].items[itemIndex].items[subitemIndex].link === submenuItemURL) {
						this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
					}
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		//Adding the topbar menu
		this.addMenu('topbar');
	}
]);
'use strict';

// Configuring the Articles module
angular.module('flights').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Flights', 'flights', 'dropdown', '/flights(/create)?');
		Menus.addSubMenuItem('topbar', 'flights', 'List Flights', 'flights');
		Menus.addSubMenuItem('topbar', 'flights', 'New Flight', 'flights/create');
	}
]);
'use strict';

//Setting up route
angular.module('flights').config(['$stateProvider',
	function($stateProvider) {
		// Flights state routing
		$stateProvider.
		state('listFlights', {
			url: '/flights',
			templateUrl: 'modules/flights/views/list-flights.client.view.html'
		}).
		state('createFlight', {
			url: '/flights/create',
			templateUrl: 'modules/flights/views/create-flight.client.view.html'
		}).
		state('viewFlight', {
			url: '/flights/:flightId',
			templateUrl: 'modules/flights/views/view-flight.client.view.html'
		}).
		state('editFlight', {
			url: '/flights/:flightId/edit',
			templateUrl: 'modules/flights/views/edit-flight.client.view.html'
		});
	}
]);
'use strict';

// Flights controller
angular.module('flights').controller('FlightsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Flights',
	function($scope, $stateParams, $location, Authentication, Flights) {
		$scope.authentication = Authentication;

		// Create new Flight
		$scope.create = function() {
			// Create new Flight object
			var flight = new Flights ({
				name: this.name
			});

			// Redirect after save
			flight.$save(function(response) {
				$location.path('flights/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Flight
		$scope.remove = function(flight) {
			if ( flight ) { 
				flight.$remove();

				for (var i in $scope.flights) {
					if ($scope.flights [i] === flight) {
						$scope.flights.splice(i, 1);
					}
				}
			} else {
				$scope.flight.$remove(function() {
					$location.path('flights');
				});
			}
		};

		// Update existing Flight
		$scope.update = function() {
			var flight = $scope.flight;

			flight.$update(function() {
				$location.path('flights/' + flight._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Flights
		$scope.find = function() {
			$scope.flights = Flights.query();
		};

		// Find existing Flight
		$scope.findOne = function() {
			$scope.flight = Flights.get({ 
				flightId: $stateParams.flightId
			});
		};
	}
]);
'use strict';

//Flights service used to communicate Flights REST endpoints
angular.module('flights').factory('Flights', ['$resource',
	function($resource) {
		return $resource('flights/:flightId', { flightId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
'use strict';

// Configuring the Articles module
angular.module('pilots').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Pilots', 'pilots', 'dropdown', '/pilots(/create)?');
		Menus.addSubMenuItem('topbar', 'pilots', 'List Pilots', 'pilots');
		Menus.addSubMenuItem('topbar', 'pilots', 'New Pilot', 'pilots/create');
	}
]);
'use strict';

//Setting up route
angular.module('pilots').config(['$stateProvider',
	function($stateProvider) {
		// Pilots state routing
		$stateProvider.
		state('listPilots', {
			url: '/pilots',
			templateUrl: 'modules/pilots/views/list-pilots.client.view.html'
		}).
		state('createPilot', {
			url: '/pilots/create',
			templateUrl: 'modules/pilots/views/create-pilot.client.view.html'
		}).
		state('viewPilot', {
			url: '/pilots/:pilotId',
			templateUrl: 'modules/pilots/views/view-pilot.client.view.html'
		}).
		state('editPilot', {
			url: '/pilots/:pilotId/edit',
			templateUrl: 'modules/pilots/views/edit-pilot.client.view.html'
		});
	}
]);
'use strict';

// Pilots controller
angular.module('pilots').controller('PilotsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Pilots',
	function($scope, $stateParams, $location, Authentication, Pilots) {
		$scope.authentication = Authentication;

		// Create new Pilot
		$scope.create = function() {
			// Create new Pilot object
			var pilot = new Pilots ({
				name: this.name
			});

			// Redirect after save
			pilot.$save(function(response) {
				$location.path('pilots/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Pilot
		$scope.remove = function(pilot) {
			if ( pilot ) { 
				pilot.$remove();

				for (var i in $scope.pilots) {
					if ($scope.pilots [i] === pilot) {
						$scope.pilots.splice(i, 1);
					}
				}
			} else {
				$scope.pilot.$remove(function() {
					$location.path('pilots');
				});
			}
		};

		// Update existing Pilot
		$scope.update = function() {
			var pilot = $scope.pilot;

			pilot.$update(function() {
				$location.path('pilots/' + pilot._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Pilots
		$scope.find = function() {
			$scope.pilots = Pilots.query();
		};

		// Find existing Pilot
		$scope.findOne = function() {
			$scope.pilot = Pilots.get({ 
				pilotId: $stateParams.pilotId
			});
		};
	}
]);
'use strict';

//Pilots service used to communicate Pilots REST endpoints
angular.module('pilots').factory('Pilots', ['$resource',
	function($resource) {
		return $resource('pilots/:pilotId', { pilotId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
'use strict';

// Configuring the Articles module
angular.module('stem4alls').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Stem4alls', 'stem4alls', 'dropdown', '/stem4alls(/create)?');
		Menus.addSubMenuItem('topbar', 'stem4alls', 'List Stem4alls', 'stem4alls');
		Menus.addSubMenuItem('topbar', 'stem4alls', 'New Stem4all', 'stem4alls/create');
	}
]);
'use strict';

//Setting up route
angular.module('stem4alls').config(['$stateProvider',
	function($stateProvider) {
		// Stem4alls state routing
		$stateProvider.
		state('listStem4alls', {
			url: '/stem4alls',
			templateUrl: 'modules/stem4alls/views/list-stem4alls.client.view.html'
		}).
		state('createStem4all', {
			url: '/stem4alls/create',
			templateUrl: 'modules/stem4alls/views/create-stem4all.client.view.html'
		}).
		state('viewStem4all', {
			url: '/stem4alls/:stem4allId',
			templateUrl: 'modules/stem4alls/views/view-stem4all.client.view.html'
		}).
		state('editStem4all', {
			url: '/stem4alls/:stem4allId/edit',
			templateUrl: 'modules/stem4alls/views/edit-stem4all.client.view.html'
		});
	}
]);
'use strict';


// Stem4alls controller
angular.module('stem4alls').controller('Stem4allsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Stem4alls'
	function($scope, $stateParams, $location, Authentication, Stem4alls) {
		$scope.authentication = Authentication;

		// upload file
		$scope.uploadFile = function($file){
			Upload.upload($file)
			.then(function (resp){
				console.log('success' +resp.config.data.file.name + 'uploaded. Response:' + resp.data);
			}, function (resp) {
				console.log('Error status:' + resp.status);
			}, function (evt) {
				var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
				console.log('progress: ' + progressPercetage + '%' + evt.config.data.file.name);
			});
			
		};

		// Create new Stem4all
		$scope.create = function() {
			// Create new Stem4all object
			var stem4all = new Stem4alls ({
				title: this.title
			});

			// Redirect after save
			stem4all.$save(function(response) {
				$location.path('stem4alls/' + response._id);

				// Clear form fields
				$scope.title = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Stem4all
		$scope.remove = function(stem4all) {
			if ( stem4all ) { 
				stem4all.$remove();

				for (var i in $scope.stem4alls) {
					if ($scope.stem4alls [i] === stem4all) {
						$scope.stem4alls.splice(i, 1);
					}
				}
			} else {
				$scope.stem4all.$remove(function() {
					$location.path('stem4alls');
				});
			}
		};

		// Update existing Stem4all
		$scope.update = function() {
			var stem4all = $scope.stem4all;

			stem4all.$update(function() {
				$location.path('stem4alls/' + stem4all._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Stem4alls
		$scope.find = function() {
			$scope.stem4alls = Stem4alls.query();
		};

		// Find existing Stem4all
		$scope.findOne = function() {
			$scope.stem4all = Stem4alls.get({ 
				stem4allId: $stateParams.stem4allId
			});
		};
	}
}]);
'use strict';

//Stem4alls service used to communicate Stem4alls REST endpoints
angular.module('stem4alls').factory('Stem4alls', ['$resource',
	function($resource) {
		return $resource('stem4alls/:stem4allId', { stem4allId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
'use strict';

// Config HTTP Error Handling
angular.module('users').config(['$httpProvider',
	function($httpProvider) {
		// Set the httpProvider "not authorized" interceptor
		$httpProvider.interceptors.push(['$q', '$location', 'Authentication',
			function($q, $location, Authentication) {
				return {
					responseError: function(rejection) {
						switch (rejection.status) {
							case 401:
								// Deauthenticate the global user
								Authentication.user = null;

								// Redirect to signin page
								$location.path('signin');
								break;
							case 403:
								// Add unauthorized behaviour 
								break;
						}

						return $q.reject(rejection);
					}
				};
			}
		]);
	}
]);
'use strict';

// Setting up route
angular.module('users').config(['$stateProvider',
	function($stateProvider) {
		// Users state routing
		$stateProvider.
		state('profile', {
			url: '/settings/profile',
			templateUrl: 'modules/users/views/settings/edit-profile.client.view.html'
		}).
		state('password', {
			url: '/settings/password',
			templateUrl: 'modules/users/views/settings/change-password.client.view.html'
		}).
		state('accounts', {
			url: '/settings/accounts',
			templateUrl: 'modules/users/views/settings/social-accounts.client.view.html'
		}).
		state('signup', {
			url: '/signup',
			templateUrl: 'modules/users/views/authentication/signup.client.view.html'
		}).
		state('signin', {
			url: '/signin',
			templateUrl: 'modules/users/views/authentication/signin.client.view.html'
		}).
		state('forgot', {
			url: '/password/forgot',
			templateUrl: 'modules/users/views/password/forgot-password.client.view.html'
		}).
		state('reset-invalid', {
			url: '/password/reset/invalid',
			templateUrl: 'modules/users/views/password/reset-password-invalid.client.view.html'
		}).
		state('reset-success', {
			url: '/password/reset/success',
			templateUrl: 'modules/users/views/password/reset-password-success.client.view.html'
		}).
		state('reset', {
			url: '/password/reset/:token',
			templateUrl: 'modules/users/views/password/reset-password.client.view.html'
		});
	}
]);
'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication',
	function($scope, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		// If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		$scope.signup = function() {
			$http.post('/auth/signup', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		$scope.signin = function() {
			$http.post('/auth/signin', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

angular.module('users').controller('PasswordController', ['$scope', '$stateParams', '$http', '$location', 'Authentication',
	function($scope, $stateParams, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		//If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		// Submit forgotten password account id
		$scope.askForPasswordReset = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/forgot', $scope.credentials).success(function(response) {
				// Show user success message and clear form
				$scope.credentials = null;
				$scope.success = response.message;

			}).error(function(response) {
				// Show user error message and clear form
				$scope.credentials = null;
				$scope.error = response.message;
			});
		};

		// Change user password
		$scope.resetUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.passwordDetails = null;

				// Attach user profile
				Authentication.user = response;

				// And redirect to the index page
				$location.path('/password/reset/success');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

angular.module('users').controller('SettingsController', ['$scope', '$http', '$location', 'Users', 'Authentication',
	function($scope, $http, $location, Users, Authentication) {
		$scope.user = Authentication.user;

		// If user is not signed in then redirect back home
		if (!$scope.user) $location.path('/');

		// Check if there are additional accounts 
		$scope.hasConnectedAdditionalSocialAccounts = function(provider) {
			for (var i in $scope.user.additionalProvidersData) {
				return true;
			}

			return false;
		};

		// Check if provider is already in use with current user
		$scope.isConnectedSocialAccount = function(provider) {
			return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
		};

		// Remove a user social account
		$scope.removeUserSocialAccount = function(provider) {
			$scope.success = $scope.error = null;

			$http.delete('/users/accounts', {
				params: {
					provider: provider
				}
			}).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.user = Authentication.user = response;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		// Update a user profile
		$scope.updateUserProfile = function(isValid) {
			if (isValid) {
				$scope.success = $scope.error = null;
				var user = new Users($scope.user);

				user.$update(function(response) {
					$scope.success = true;
					Authentication.user = response;
				}, function(response) {
					$scope.error = response.data.message;
				});
			} else {
				$scope.submitted = true;
			}
		};

		// Change user password
		$scope.changeUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/users/password', $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.passwordDetails = null;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', [
	function() {
		var _this = this;

		_this._data = {
			user: window.user
		};

		return _this._data;
	}
]);
'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', ['$resource',
	function($resource) {
		return $resource('users', {}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);