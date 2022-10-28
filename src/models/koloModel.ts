import { komentarModel } from "./komentarModel";
import { utakmicaModel } from "./utakmicaModel";

export interface koloModel{
    id: number;
    naziv: string;
    odigrano: boolean;

    utakmice_kola: utakmicaModel[];
    komentari: komentarModel[];
}