import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

import { Auth0ClientService, AuthService } from '@auth0/auth0-angular';
import { environment } from 'src/environments/environment';
//import { koloModel } from 'src/models/koloModel';
import { utakmicaModel } from 'src/models/utakmicaModel';

import { JwtHelperService } from '@auth0/angular-jwt';
import { koloModel } from 'src/models/koloModel';
import { komentarModel } from 'src/models/komentarModel';



@Component({
  selector: 'app-auth-initializer',
  templateUrl: './auth-initializer.component.html',
  styleUrls: ['./auth-initializer.component.css']
})
export class AuthInitializerComponent implements OnInit {

  displayedColumns: string[] = ['datum', 'lokacija', 'protivnik1', 'rezultat', 'protivnik2'];

  userRoles: string[] = [];
  username: string = "";
  email: string = "";
  currentId: number = 0;

  newComment: boolean = false;
  editingComment: boolean = false;
  editCommentId: number = 0;

  commentValue: string = "";
  koloId: number = 0;

  kola: koloModel[] = [
    {
      id:1, naziv:'12. Kolo', odigrano:true, 
      utakmice_kola: [
        {id:1, datum:'21.10.2022. 18:00', lokacija: 'Gradski stadion Poljud, Split', odigrana:false, protivnik1:'Hajduk', protivnik2:'Dinamo', rezultat:'- : -'},
        {id:2, datum:'22.10.2022. 17:10', lokacija: 'Stadion Varteks, Varaždin', odigrana:false, protivnik1:'Varaždin', protivnik2:'Osijek', rezultat:'- : -'},
        {id:3, datum:'23.10.2022. 15:00', lokacija: 'Aldo Drosina, Pula', odigrana:false, protivnik1:'Istra 1961', protivnik2:'Šibenik', rezultat:'- : -'},
        {id:4, datum:'23.10.2022. 17:10', lokacija: 'Gradski stadion Ivan Kušek Apaš, Koprivnica', odigrana:false, protivnik1:'Slaven Belupo', protivnik2:'Rijeka', rezultat:'- : -'},
        {id:5, datum:'22.10.2022. 15:00', lokacija: 'Nogometni stadion Zagreb, Zagreb', odigrana:false, protivnik1:'Lokomotiva', protivnik2:'Velika Gorica', rezultat:'- : -'}
      ],
      komentari: [{id: 1, datum:'10/22/2022, 13:52:23', comment:'livajaaaa', user:'Marko', email:'marko@net.hr'}]
    },
    {
      id:2, naziv:'13. Kolo', odigrano:true, 
      utakmice_kola: [
        {id:1, datum:'08.10.2022. 19:05', lokacija: 'Gradski stadion, Velika Gorica', odigrana:true, protivnik1:'Velika Gorica', protivnik2:'Hajduk', rezultat:'0 : 1'},
        {id:2, datum:'08.10.2022. 16:30', lokacija: 'HNK Rijeka, Rijeka', odigrana:true, protivnik1:'Rijeka', protivnik2:'Lokomotiva', rezultat:'3 : 0'},
        {id:3, datum:'09.10.2022. 15:00', lokacija: 'Šubićeva, Šibenik', odigrana:true, protivnik1:'Šibenik', protivnik2:'Slaven Belupo', rezultat:'0 : 2'},
        {id:4, datum:'07.10.2022. 18:00', lokacija: 'Stadion gradski vrt, Osijek', odigrana:true, protivnik1:'Osijek', protivnik2:'Istra 1961', rezultat:'2 : 0'},
        {id:5, datum:'09.10.2022. 17:10', lokacija: 'Stadion Maksimir, Zagreb', odigrana:true, protivnik1:'Dinamo', protivnik2:'Varaždin', rezultat:'3 : 1'}
      ],
      komentari: []
    },
    {
      id:3, naziv:'14. Kolo', odigrano:false, 
      utakmice_kola: [
        {id:1, datum:'21.10.2022. 18:00', lokacija: 'Gradski stadion Poljud, Split', odigrana:false, protivnik1:'Hajduk', protivnik2:'Dinamo', rezultat:'- : -'},
        {id:2, datum:'22.10.2022. 17:10', lokacija: 'Stadion Varteks, Varaždin', odigrana:false, protivnik1:'Varaždin', protivnik2:'Osijek', rezultat:'- : -'},
        {id:3, datum:'23.10.2022. 15:00', lokacija: 'Aldo Drosina, Pula', odigrana:false, protivnik1:'Istra 1961', protivnik2:'Šibenik', rezultat:'- : -'},
        {id:4, datum:'23.10.2022. 17:10', lokacija: 'Gradski stadion Ivan Kušek Apaš, Koprivnica', odigrana:false, protivnik1:'Slaven Belupo', protivnik2:'Rijeka', rezultat:'- : -'},
        {id:5, datum:'22.10.2022. 15:00', lokacija: 'Nogometni stadion Zagreb, Zagreb', odigrana:false, protivnik1:'Lokomotiva', protivnik2:'Velika Gorica', rezultat:'- : -'}
      ],
      komentari: []
    }
  ]

  constructor(@Inject(DOCUMENT) public document: Document,
              public auth: AuthService) { }

  ngOnInit(): void {
    this.auth.isAuthenticated$.subscribe(authenticated => {
      this.auth.user$.subscribe(user => {
        this.username = user!.nickname!
        this.email = user!.name!
      })


      if(authenticated) {
        let userRaw = localStorage.getItem(`@@auth0spajs@@::${environment.clientId}::default::openid profile email`)
        let user = JSON.parse(userRaw!)
        
        let id_token = user.body.id_token

        let helper = new JwtHelperService()

        let decoded_id_token = helper.decodeToken(id_token)

        this.userRoles = decoded_id_token[`${environment.baseUrl}/roles`];

      }
    })
  }

  addComment(id: number) {
    this.currentId = id;
    this.newComment = true;
  }

  onCommentSubmit() {
    if(this.editingComment) {
      this.kola[this.koloId-1].komentari[this.editCommentId-1].comment = this.commentValue
    }
    else {
      this.kola[this.koloId-1].komentari.push({
        id: this.kola[this.koloId-1].komentari.length+1,
        comment: this.commentValue,
        datum: new Date().toLocaleString('en-US', { hour12: false }),
        user: this.username,
        email: this.email
      })

      this.newComment = false;
      this.commentValue = "";
    }
  }

  cancelComment() {
    if(!this.editingComment)
      this.commentValue = "";
    this.newComment = false;
    this.editingComment = false;
  }

  deleteComment(commentId: number, koloId: number) {
    this.kola[koloId-1].komentari.splice(commentId-1, 1)
  }

  editComment(commentId: number, comment:string) {
    this.editCommentId = commentId;
    this.commentValue = comment;
    this.editingComment = true;
  }

  passInfo(id: number) {
    this.koloId = id;
  }
}
