import {Component, View} from "angular2/core";
import {Http, Request, RequestMethod, Headers, HTTP_PROVIDERS} from "angular2/http";
import {Router} from "angular2/router";
import {AuthManager} from "../authmanager";
import {IProject} from "../interfaces";

@Component({
    selector: "projects",
    viewProviders: [HTTP_PROVIDERS, AuthManager]
})

@View({
    templateUrl: "app/projects/projects.html"
})

export class ProjectsPage {

    http: Http;
    projects: Array<Object>;
    owners: Array<Object>;
    authManager: AuthManager;

    constructor(http: Http, router: Router, authManager: AuthManager) {
        this.authManager = authManager;
        if (!authManager.isAuthenticated()) {
            router.navigate(["Auth"]);
        }
        this.http = http;
        this.getUsers();
        this.getProjects();
    }

    getUsers() {
        this.owners = [];
        this.http.get("/api/user/getAll")
        .subscribe((success) => {
            var jsonResponse = success.json();
            for(var i = 0; i < jsonResponse.length; i++) {
                this.owners.push(
                    {
                        id: jsonResponse[i]._id,
                        firstname: jsonResponse[i].name.first,
                        lastname: jsonResponse[i].name.last
                    }
                );
            }
        }, (error) => {
            console.error(JSON.stringify(error));
        });
    }

    getProjects() {
        this.projects = [];
        this.http.get("/api/project/getAll/" + this.authManager.getAuthToken())
        .subscribe((success) => {
            var jsonResponse = success.json();
            for(var i = 0; i < jsonResponse.length; i++) {
                this.projects.push(
                    {
                        id: jsonResponse[i]._id,
                        name: jsonResponse[i].name,
                        description: jsonResponse[i].description
                    }
                );
            }
        }, (error) => {
            console.error(error.json());
        });
    }

    create(name: string, description: string) {
        var postBody: IProject = {
            name: name,
            description: description,
            owner: this.authManager.getAuthToken(),
            users: [],
            tasks: []
        }
        var requestHeaders = new Headers();
        requestHeaders.append("Content-Type", "application/json");
        this.http.request(new Request({
            method: RequestMethod.Post,
            url: "/api/project/create",
            body: JSON.stringify(postBody),
            headers: requestHeaders
        }))
        .subscribe((success) => {
            postBody.id = success.json()._id;
            this.projects.push(postBody);
        }, (error) => {
            console.log("ERROR -> " + JSON.stringify(error));
        });
    }

}
