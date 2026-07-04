# PiT-Terapy

Moderná jednostránková prezentácia pre Mareka Pittnera – PiT-Terapy v Malackách.

## Lokálne spustenie

Web je čistý statický projekt bez build kroku. Spustiť sa dá ľubovoľným lokálnym HTTP serverom, napríklad:

```powershell
python -m http.server 4173
```

Potom otvorte `http://localhost:4173`.

## Nasadenie

Projekt je pripravený na priame nasadenie cez Vercel. Root projektu je koreň repozitára a nie je potrebný žiadny build command.

## Obsah pred ostrým spustením

Treba potvrdiť:

- definitívnu cenu terapie po augustovej zmene,
- oficiálny zápis názvu značky,
- otváracie hodiny,
- IČO a právne údaje prevádzkovateľa,
- finálnu doménu a odkazy na sociálne siete.

Podrobný pracovný brief je v priečinku `PIT-TERAPY-NAVRH`.
