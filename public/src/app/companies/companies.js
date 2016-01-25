"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("angular2/core");
var http_1 = require("angular2/http");
var router_1 = require("angular2/router");
var authmanager_1 = require("../authmanager");
var utility_1 = require("../utility");
var CompaniesPage = (function () {
    function CompaniesPage(http, router, authManager, utility) {
        var _this = this;
        if (!authManager.isAuthenticated()) {
            router.navigate(["Auth"]);
        }
        this.http = http;
        this.utility = utility;
        this.companies = [];
        this.utility.makeGetRequest("/api/company/getAll", []).then(function (result) {
            _this.companies = result;
        }, function (error) {
            console.error(error);
        });
    }
    CompaniesPage.prototype.create = function (name, street, city, state, zip, country, phone, website) {
        var _this = this;
        this.utility.makePostRequest("/api/company/create", [], {
            name: name,
            address: {
                street: street,
                city: city,
                state: state,
                country: country,
                zip: zip
            },
            phone: phone,
            website: website
        }).then(function (result) {
            _this.companies.push(result);
        }, function (error) {
            console.error(error);
        });
    };
    CompaniesPage = __decorate([
        core_1.Component({
            selector: "companies",
            viewProviders: [http_1.HTTP_PROVIDERS, authmanager_1.AuthManager, utility_1.Utility]
        }),
        core_1.View({
            templateUrl: "app/companies/companies.html"
        }), 
        __metadata('design:paramtypes', [http_1.Http, router_1.Router, authmanager_1.AuthManager, utility_1.Utility])
    ], CompaniesPage);
    return CompaniesPage;
})();
exports.CompaniesPage = CompaniesPage;
