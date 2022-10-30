import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

import { Auth0ClientService, AuthService } from '@auth0/auth0-angular';
import { environment } from 'src/environments/environment';
//import { koloModel } from 'src/models/koloModel';
import { utakmicaModel } from 'src/models/utakmicaModel';

import { JwtHelperService } from '@auth0/angular-jwt';
import { koloModel } from 'src/models/koloModel';
import { komentarModel } from 'src/models/komentarModel';
import { ljetstvicaModel } from 'src/models/ljestvicaModel';
import { MatSort } from '@angular/material/sort';
import { MatTab } from '@angular/material/tabs';



@Component({
  selector: 'app-auth-initializer',
  templateUrl: './auth-initializer.component.html',
  styleUrls: ['./auth-initializer.component.css']
})
export class AuthInitializerComponent implements OnInit {
  displayedColumnsKolo: string[] = ['datum', 'lokacija', 'protivnik1', 'rezultat', 'protivnik2'];
  displayedColumnsPoredak: string[] = ['no', 'klub', 'ukupno', 'pobjede', 'nerjeseno', 'porazi', 'bodovi'];

  userRoles: string[] = ['anonymous'];
  username: string = "";
  email: string = "";
  currentId: number = 0;

  newComment: boolean = false;
  editingComment: boolean = false;
  editCommentId: number = 0;

  commentValue: string = "";
  koloId: number = 0;

  tablica_poretka: ljetstvicaModel[] = [
    {id:1, poredak: 1, klub: 'Hajduk', ukupno_odigranih_utakmica: 0, broj_pobjeda:0, broj_nerjesenih:0, broj_poraza:0, bodovi: 0},
    {id:2, poredak: 1, klub: 'Dinamo', ukupno_odigranih_utakmica: 0, broj_pobjeda:0, broj_nerjesenih:0, broj_poraza:0, bodovi: 0},
    {id:3, poredak: 1, klub: 'Varaždin', ukupno_odigranih_utakmica: 0, broj_pobjeda:0, broj_nerjesenih:0, broj_poraza:0, bodovi: 0},
    {id:4, poredak: 1, klub: 'Osijek', ukupno_odigranih_utakmica: 0, broj_pobjeda:0, broj_nerjesenih:0, broj_poraza:0, bodovi: 0},
    {id:5, poredak: 1, klub: 'Istra 1961', ukupno_odigranih_utakmica: 0, broj_pobjeda:0, broj_nerjesenih:0, broj_poraza:0, bodovi: 0},
    {id:6, poredak: 1, klub: 'Šibenik', ukupno_odigranih_utakmica: 0, broj_pobjeda:0, broj_nerjesenih:0, broj_poraza:0, bodovi: 0},
    {id:7, poredak: 1, klub: 'Slaven Belupo', ukupno_odigranih_utakmica: 0, broj_pobjeda:0, broj_nerjesenih:0, broj_poraza:0, bodovi: 0},
    {id:8, poredak: 1, klub: 'Rijeka', ukupno_odigranih_utakmica: 0, broj_pobjeda:0, broj_nerjesenih:0, broj_poraza:0, bodovi: 0},
    {id:9, poredak: 1, klub: 'Lokomotiva', ukupno_odigranih_utakmica: 0, broj_pobjeda:0, broj_nerjesenih:0, broj_poraza:0, bodovi: 0},
    {id:10, poredak: 1, klub: 'Velika Gorica', ukupno_odigranih_utakmica: 0, broj_pobjeda:0, broj_nerjesenih:0, broj_poraza:0, bodovi: 0}
  ]

  kola: koloModel[] = [
    {
      id:1, naziv:'12. Kolo', odigrano:true, 
      utakmice_kola: [
        {id:1, datum:'08.10.2022. 19:05', lokacija: 'Gradski stadion Poljud, Split', odigrana:true, protivnik1:'Hajduk', protivnik2:'Varaždin', rezultat:'2 : 1'},
        {id:2, datum:'08.10.2022. 17:10', lokacija: 'Aldo Drosina, Pula', odigrana:false, protivnik1:'Istra 1961', protivnik2:'Dinamo', rezultat:'- : -'},
        {id:3, datum:'09.10.2022. 15:00', lokacija: 'Gradski stadion Ivan Kušek Apaš, Koprivnica', odigrana:true, protivnik1:'Slaven Belupo', protivnik2:'Osijek', rezultat:'0 : 4'},
        {id:4, datum:'07.10.2022. 18:00', lokacija: 'Nogometni stadion Zagreb, Zagreb', odigrana:true, protivnik1:'Lokomotiva', protivnik2:'Šibenik', rezultat:'1 : 1'},
        {id:5, datum:'09.10.2022. 17:10', lokacija: 'Gradski stadion, Velika Gorica', odigrana:true, protivnik1:'Velika Gorica', protivnik2:'Rijeka', rezultat:'0 : 2'}
      ],
      komentari: [{id: 1, datum:'10/22/2022, 13:52:23', comment:'livajaaaa', user:'Marko', email:'marko@net.hr'}]
    },
    {
      id:2, naziv:'13. Kolo', odigrano:true, 
      utakmice_kola: [
        {id:1, datum:'15.10.2022. 19:05', lokacija: 'Gradski stadion, Velika Gorica', odigrana:true, protivnik1:'Velika Gorica', protivnik2:'Hajduk', rezultat:'0 : 1'},
        {id:2, datum:'16.10.2022. 17:10', lokacija: 'HNK Rijeka, Rijeka', odigrana:true, protivnik1:'Rijeka', protivnik2:'Lokomotiva', rezultat:'3 : 0'},
        {id:3, datum:'14.10.2022. 18:00', lokacija: 'Šubićeva, Šibenik', odigrana:true, protivnik1:'Šibenik', protivnik2:'Slaven Belupo', rezultat:'0 : 2'},
        {id:4, datum:'15.10.2022. 16:55', lokacija: 'Stadion gradski vrt, Osijek', odigrana:true, protivnik1:'Osijek', protivnik2:'Istra 1961', rezultat:'2 : 0'},
        {id:5, datum:'16.10.2022. 15:00', lokacija: 'Stadion Maksimir, Zagreb', odigrana:true, protivnik1:'Dinamo', protivnik2:'Varaždin', rezultat:'3 : 1'}
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

  dataSource = new MatTableDataSource(this.tablica_poretka)

  constructor(@Inject(DOCUMENT) public document: Document,
              public auth: AuthService) { }

  ngOnInit(): void {
    this.auth.isAuthenticated$.subscribe(authenticated => {
      if(authenticated) {
        this.auth.user$.subscribe(user => {
          if(user){
            this.username = user.nickname || ""
            this.email = user.name || ""
          }
        })
      }


      if(authenticated) {
        let userRaw = localStorage.getItem(`@@auth0spajs@@::${environment.clientId}::default::openid profile email`)
        let user = JSON.parse(userRaw!)
        
        let id_token = user.body.id_token

        let helper = new JwtHelperService()

        let decoded_id_token = helper.decodeToken(id_token)

        this.userRoles = decoded_id_token[`${environment.baseUrl}/roles`];

        
      }
    })

    this.calculatePoints();
  }

  calculatePoints() {
    this.kola.forEach(kolo => {
      kolo.utakmice_kola.forEach(utakmica => {
        let rez_arr = utakmica.rezultat.split(" : ")
        let rez1 = rez_arr[0] || 0
        let rez2 = rez_arr[1] || 0

        if (rez1 != "-" && rez2 != "-"){
          this.tablica_poretka.forEach(klub => {
            if(klub.klub == utakmica.protivnik1) {
              klub.ukupno_odigranih_utakmica++;
              
              if (rez1==rez2)
                klub.broj_nerjesenih++;
              else if (Number(rez1) > Number(rez2))
                klub.broj_pobjeda++;
              else
                klub.broj_poraza++;
            }
            else if(klub.klub == utakmica.protivnik2) {
              klub.ukupno_odigranih_utakmica++;
              if (rez1==rez2)
                klub.broj_nerjesenih++;
              else if (Number(rez2) > Number(rez1))
                klub.broj_pobjeda++;
              else
                klub.broj_poraza++;
            }

          })
        }
      })
    })

    this.tablica_poretka.forEach(klub => {
      klub.bodovi = (klub.broj_pobjeda*3)+(klub.broj_nerjesenih);
    })
    this.tablica_poretka.sort((a,b) => b.bodovi - a.bodovi)
    for (let i=0; i<this.tablica_poretka.length; i++) {
      this.tablica_poretka[i].poredak = i+1;
    }

    this.dataSource = new MatTableDataSource(this.tablica_poretka)
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
