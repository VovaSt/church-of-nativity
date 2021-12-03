import { Component, OnInit } from '@angular/core';
import { ProjectData } from 'src/app/models/project-data.model';

@Component({
    selector: 'app-projects',
    templateUrl: './projects.component.html',
    styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {

    projects: ProjectData[] = [
        {
            id: 1,
            name: 'project1',
            description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corporis ipsum accusantium ab sapiente exercitationem pariatur dolorem eum, hic itaque quas fuga magni natus. Ratione perferendis ea, numquam vero sint, fuga magni ex veritatis expedita illo dignissimos! Rerum in dolore praesentium.",
            photo: 'assets/images/IMG_8263.JPG',
            needMoney: 10000,
            haveMoney: 1600
        },
        {
            id: 2,
            name: 'project2',
            description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corporis ipsum accusantium ab sapiente exercitationem pariatur dolorem eum, hic itaque quas fuga magni natus. Ratione perferendis ea, numquam vero sint, fuga magni ex veritatis expedita illo dignissimos! Rerum in dolore praesentium.",
            photo: 'assets/images/IMG_8263.JPG',
            needMoney: 2000,
            haveMoney: 1300
        },
        {
            id: 3,
            name: 'project3',
            description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corporis ipsum accusantium ab sapiente exercitationem pariatur dolorem eum, hic itaque quas fuga magni natus. Ratione perferendis ea, numquam vero sint, fuga magni ex veritatis expedita illo dignissimos! Rerum in dolore praesentium.",
            photo: 'assets/images/IMG_8263.JPG',
            needMoney: 500,
            haveMoney: 100
        },
        {
            id: 4,
            name: 'project4',
            description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corporis ipsum accusantium ab sapiente exercitationem pariatur dolorem eum, hic itaque quas fuga magni natus. Ratione perferendis ea, numquam vero sint, fuga magni ex veritatis expedita illo dignissimos! Rerum in dolore praesentium.",
            photo: 'assets/images/IMG_8263.JPG',
            needMoney: 300,
            haveMoney: 258
        }
    ]

    constructor() { }

    ngOnInit(): void {
    }

}
