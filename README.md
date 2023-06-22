# 2023-hui-masterarbeit

Frontend: hier
Database: Neo4j auf _AWS EC2_
Backend: [backend](https://github.com/huichen5796/ma_backend) auf _AWS EC2_

Dies geht um Kryokonservierung...

wird kurzzeitig in solche Schritte unterteilt:

- Dantenbank zur Speicherung alle Messungen
    - Pre-Data von Zellen wie Rundheit, Durchmesse, ...
    - Parameters über Einfrierensverfahren, wie Rate, ...
    - Parameters über Einfrierenslösung, wie Zusatz, ...
    - Post-Data von Zellen wie Rundheit, Durchmesse, Überlebensrate, ...

- Tools für die Darstellung und Analyse der Daten in Datenbank
    - Analysetools, von Daten zum Diagramm bzw. Kurve, über Tendenz, Mittelwerte, ...
    - Extraktionstools, Suche Daten von chaotischen Daten
    - Prognosetools mit ggf. Maschinellem Lernen / Deep Learning
        - Backbone von Modell
        - Training von überwachtem Lernen
            - Inputs: Pre-Data der Zellen, Parameters über Einfrierensverfahren und Parameters über Einfrierenslösung in Datenbank
            - Outputs: Post-Data der Zellen
        - Am Ende sollte Vorhersage zu Post-Data auskommen, wenn Pre-Dara und Parameters gegeben wurden.
    - ggf. könnten die Parameters mit alle Tools verbessert werden
    - ggf. etwas über UI