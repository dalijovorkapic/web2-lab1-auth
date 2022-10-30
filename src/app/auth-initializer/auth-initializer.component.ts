import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

//biblioteka za spajanje i komuniciranje sa auth0
import { AuthService } from '@auth0/auth0-angular';


import { environment } from 'src/environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';
import { koloModel } from 'src/models/koloModel';
import { ljetstvicaModel } from 'src/models/ljestvicaModel';
import { delay, of } from 'rxjs';



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
  currentMatchId: number = 0;
  currentKoloId: number = 0;
  showEditScoreInput: boolean = false;

  temp_tablica: ljetstvicaModel[] = [];

  newComment: boolean = false;
  editingComment: boolean = false;
  editCommentId: number = 0;
  token_expiration: number = 0;

  commentValue: string = "";
  score1: number;
  score2: number;
  koloId: number = 0;

  //tablica za bodovanje klubova
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


  //tablica kola i pripadajućih utakmica i komentara
  kola: koloModel[] = [
    {
      id:1, naziv:'11. Kolo', odigrano:true, 
      utakmice_kola: [
        {id:1, datum:'02.10.2022. 15:00', lokacija: 'HNK Rijeka', odigrana:true, protivnik1:'Rijeka', protivnik2:'Hajduk', rezultat:'0 : 1'},
        {id:2, datum:'02.10.2022. 17:30', lokacija: 'Šubićeva, Šibenik', odigrana:true, protivnik1:'Šibenik', protivnik2:'Velika Gorica', rezultat:'1 : 1'},
        {id:3, datum:'01.10.2022. 16:55', lokacija: 'Stadion gradski vrt, Osijek', odigrana:true, protivnik1:'Osijek', protivnik2:'Lokomotiva', rezultat:'4 : 1'},
        {id:4, datum:'01.10.2022. 19:30', lokacija: 'Stadion Maksimir, Zagreb', odigrana:true, protivnik1:'Dinamo', protivnik2:'Slaven Belupo', rezultat:'4 : 1'},
        {id:5, datum:'30.09.2022. 18:00', lokacija: 'Stadion Varteks, Varaždin', odigrana:true, protivnik1:'Varaždin', protivnik2:'Istra 1961', rezultat:'1 : 1'}
      ],
      komentari: [{id: 1, datum:'03.10.2022, 17:52:23', comment:'Kritična igra', user:'marko.markic', email:'marko.markic@gmail.com'},
                  {id: 2, datum:'03.10.2022, 17:52:23', comment:'Lijepe riječi molim! :)', user:'admin', email:'admin@net.hr'}]
    },
    {
      id:2, naziv:'12. Kolo', odigrano:true, 
      utakmice_kola: [
        {id:1, datum:'08.10.2022. 19:05', lokacija: 'Gradski stadion Poljud, Split', odigrana:true, protivnik1:'Hajduk', protivnik2:'Varaždin', rezultat:'2 : 1'},
        {id:2, datum:'08.10.2022. 17:10', lokacija: 'Aldo Drosina, Pula', odigrana:false, protivnik1:'Istra 1961', protivnik2:'Dinamo', rezultat:'- : -'},
        {id:3, datum:'09.10.2022. 15:00', lokacija: 'Gradski stadion Ivan Kušek Apaš, Koprivnica', odigrana:true, protivnik1:'Slaven Belupo', protivnik2:'Osijek', rezultat:'0 : 4'},
        {id:4, datum:'07.10.2022. 18:00', lokacija: 'Nogometni stadion Zagreb, Zagreb', odigrana:true, protivnik1:'Lokomotiva', protivnik2:'Šibenik', rezultat:'1 : 1'},
        {id:5, datum:'09.10.2022. 17:10', lokacija: 'Gradski stadion, Velika Gorica', odigrana:true, protivnik1:'Velika Gorica', protivnik2:'Rijeka', rezultat:'0 : 2'}
      ],
      komentari: [{id: 1, datum:'09.10.2022, 14:12:23', comment:'Trofej ide u Rijeku D:', user:'bruno.brunic', email:'bruno.brunic@gmail.com'},
                  {id: 2, datum:'10.10.2022, 18:52:23', comment:'@bruno.brunic kako da ne :P', user:'marko.markic', email:'marko.markic@gmail.com'}]
    },
    {
      id:3, naziv:'13. Kolo', odigrano:true, 
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
      id:4, naziv:'14. Kolo', odigrano:false, 
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

    //provjera dali je korisnik autentificiran i dohvaćanje njegovih informacija
    this.auth.isAuthenticated$.subscribe(authenticated => {
      if(authenticated) {
        this.auth.user$.subscribe(user => {
          if(user){
            this.username = user.nickname || ""
            this.email = user.name || ""
          }
        })

        let userRaw = localStorage.getItem(`@@auth0spajs@@::${environment.clientId}::default::openid profile email`)
        let user = JSON.parse(userRaw!)
        
        let id_token = user.body.id_token
      
        let helper = new JwtHelperService()

        //dekodiranje jwt tokena
        let decoded_id_token = helper.decodeToken(id_token)

        //dohvat poslanih autorizacijskih uloga kroz jwt token
        this.userRoles = decoded_id_token[`${environment.baseUrl}/roles`];

        this.token_expiration = user.body.expires_in

        this.calculatePoints;
        this.logoutTimer(this.token_expiration)

      }
    })

    this.calculatePoints();
  }

  logoutTimer(timeout:number) {
    of(null).pipe(delay(timeout)).subscribe((expired) => {
      console.log('EXPIRED!!');

      this.auth.logout({ returnTo: document.location.origin })
    })
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
    this.commentValue = "";
  }

  onCommentSubmit() {
    if(this.editingComment) {
      this.kola[this.koloId-1].komentari.forEach(komentar => {
        if(komentar.id == this.editCommentId) {
          komentar.comment = this.commentValue
        }
      })
      this.editingComment = false;
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
    for(let i=0; i< this.kola[koloId-1].komentari.length; i++) {
      if(commentId == this.kola[koloId-1].komentari[i].id){
        this.kola[koloId-1].komentari.splice(i,1);
      }
    }
  }

  editComment(commentId: number, comment:string, kolo_id:number) {
    this.editingComment = true;
    this.currentId = kolo_id;
    this.editCommentId = commentId;
    this.commentValue = comment;
  }

  passInfo(id: number) {
    this.koloId = id;
  }

  editScore(match_id: number, kolo_id: number) {
    let rez_arr = this.kola[kolo_id-1].utakmice_kola[match_id-1].rezultat.split(" : ")
    let rez1 = rez_arr[0] || 0
    let rez2 = rez_arr[1] || 0
    if(rez1 != "-" && rez2 != "-") {
      this.score1 = Number(rez1)
      this.score2 = Number(rez2)
    }
    else {
      this.score1 = 0;
      this.score2 = 0;
    }
    this.currentMatchId = match_id;
    this.currentKoloId = kolo_id;
    this.showEditScoreInput = true;
  }

  onScoreSubmit(kolo_id: number, match_id: number) {
    this.tablica_poretka.forEach(klub => {
      klub.bodovi = 0;
      klub.ukupno_odigranih_utakmica = 0;
      klub.broj_nerjesenih = 0;
      klub.broj_pobjeda = 0;
      klub.broj_poraza = 0;
    })

    this.kola[kolo_id-1].utakmice_kola[match_id-1].rezultat = this.score1+" : "+this.score2
    this.score1 = 0;
    this.score2 = 0;
    this.showEditScoreInput = false;

    this.calculatePoints();
  }

  cancelScoreEdit(kolo_id:number, match_id:number) {
    this.showEditScoreInput = false;
    let rez_arr = this.kola[kolo_id-1].utakmice_kola[match_id-1].rezultat.split(" : ")
    let rez1 = rez_arr[0] || 0
    let rez2 = rez_arr[1] || 0
    if(rez1 != "-" && rez2 != "-") {
      this.score1 = Number(rez1)
      this.score2 = Number(rez2)
    }
    else {
      this.score1 = 0;
      this.score2 = 0;
    }
  }
}
