from SPARQLWrapper import SPARQLWrapper, JSON

wikiData = SPARQLWrapper("https://query.wikidata.org/bigdata/namespace/wdq/sparql")
wikiData.setReturnFormat(JSON)
wikiData.setTimeout(200)

def askWikidata(query):

    wikiData.setQuery(query)
    try:
        ret = wikiData.queryAndConvert() 
        return ret
    except Exception as e:
        print(e)
query5 = """PREFIX wd: <http://www.wikidata.org/entity/>
PREFIX wdt: <http://www.wikidata.org/prop/direct/>
PREFIX wikibase: <http://wikiba.se/ontology#>
PREFIX bd: <http://www.bigdata.com/rdf#>

SELECT ?item1 ?name1 ?director
WHERE {
  VALUES ?type1 { wd:Q5398426 wd:Q11424 } ?item1 wdt:P31 ?type1 .
  ?item1 rdfs:label ?name1.
  #OPTIONAL { ?item1 wdt:P1476 ?name1. }
  FILTER(LANG(?name1)="en")

  FILTER(REGEX(?name1, "Submarine", "i"))
  ?item wdt:P57 ?director.

}
LIMIT 10"""
def getMovieInfoByLabel(movieLabel):
    
    query="""PREFIX wd: <http://www.wikidata.org/entity/>
    PREFIX wdt: <http://www.wikidata.org/prop/direct/>
    PREFIX wikibase: <http://wikiba.se/ontology#>
    PREFIX bd: <http://www.bigdata.com/rdf#>

    SELECT ?movie ?title ?director
    WHERE {
    VALUES ?type1 { wd:Q5398426 wd:Q11424} ?movie wdt:P31 ?type1 .
    ?movie rdfs:label ?title
    #OPTIONAL { ?item1 wdt:P1476 ?name1. }
    FILTER(LANG(?title)="en")

    FILTER(REGEX(?title,'"""+movieLabel+"""' , "i"))
    ?movie wdt:P57 ?director.
    }
    LIMIT 14"""
    movie = askWikidata(query)
    director = movie["results"]["bindings"][0]["director"]["value"]
    return director

def getMovieInfoByImdbId(imdbId):
    
    query="""PREFIX wd: <http://www.wikidata.org/entity/>
    PREFIX wdt: <http://www.wikidata.org/prop/direct/>
    PREFIX wikibase: <http://wikiba.se/ontology#>
    PREFIX bd: <http://www.bigdata.com/rdf#>

    SELECT ?director ?genre ?producer ?writer ?artist
    WHERE {
    VALUES ?type1 { wd:Q5398426 wd:Q11424} ?movie wdt:P31 ?type1 .
    ?movie wdt:P345 'tt"""+imdbId+"""'.
    ?movie wdt:P57 ?director.
    ?movie wdt:P136 ?genre.
    ?movie wdt:P162 ?producer.
    ?movie wdt:P161 ?artist.
    ?movie wdt:P58 ?writer.
    }
    LIMIT 1"""
    movie = askWikidata(query)
    director = ""
    genre = ""
    producer = ""
    writer = ""
    artist = ""
    if(movie and len(movie["results"]["bindings"])>0):
        director = movie["results"]["bindings"][0]["director"]["value"]
        genre = movie["results"]["bindings"][0]["genre"]["value"]
        producer = movie["results"]["bindings"][0]["producer"]["value"]
        writer = movie["results"]["bindings"][0]["writer"]["value"]
        artist = movie["results"]["bindings"][0]["artist"]["value"]
    return director,genre,producer,writer,artist
def getMoviesInfo(imdbIDs):
    directors = ""
    genres = ""
    producers = ""
    writers =""
    artists =""
    for imdbId in imdbIDs:
        director,genre,producer,writer,artist = getMovieInfoByImdbId(imdbId)
        directors+=(" <"+director+">")
        genres+=(" <"+genre+">")
        producers+= (" <"+producer+">")
        writers+= (" <"+writer+">")
        artists+= (" <"+artist+">")
    return directors,genres,producers,writers,artists
def getWikiRecommendation(directors,genres,producers,writers,artists):
    queryWithAnd ="""
    PREFIX wd: <http://www.wikidata.org/entity/>
    PREFIX wdt: <http://www.wikidata.org/prop/direct/>
    PREFIX wikibase: <http://wikiba.se/ontology#>
    PREFIX bd: <http://www.bigdata.com/rdf#>

    SELECT ?movie ?title ?director ?genre ?producer ?imdb ?date
    WHERE {
    VALUES ?type1 { wd:Q5398426 wd:Q11424} ?movie wdt:P31 ?type1 .
    VALUES ?director {"""+directors+""" }
        ?movie wdt:P57 ?director.
    VALUES ?producer {"""+producers+""" }
        ?movie wdt:P162 ?producer.
    VALUES ?genreQ {"""+genres+""" }
        ?movie wdt:P136 ?genreQ.
    VALUES ?writer {"""+writers+""" }
        ?movie wdt:P58 ?writer.

    OPTIONAL { ?movie wdt:P345 ?imdb .}
    ?movie wdt:P136 ?genreQ.
    ?movie wdt:P577 ?date.
    ?movie wdt:P1476 ?title.
    ?genreQ rdfs:label ?genre.
    FILTER(LANG(?title)="en")
    FILTER(LANG(?genre)="en")    }
    """
    queryWithOr ="""
    PREFIX wd: <http://www.wikidata.org/entity/>
    PREFIX wdt: <http://www.wikidata.org/prop/direct/>
    PREFIX wikibase: <http://wikiba.se/ontology#>
    PREFIX bd: <http://www.bigdata.com/rdf#>

    SELECT ?movie ?title ?director ?genre ?producer ?imdb ?date
    WHERE {
    VALUES ?type1 { wd:Q5398426 wd:Q11424} ?movie wdt:P31 ?type1 .
    VALUES ?contributor {"""+directors +writers+ artists +producers+""" }
        ?movie wdt:P57 |wdt:P162 |wdt:P58 | wdt:P161 ?contributor.
 

    OPTIONAL { ?movie wdt:P345 ?imdb .}
    ?movie wdt:P136 ?genreQ.
    ?movie wdt:P577 ?date.
    ?movie wdt:P1476 ?title.
    ?genreQ rdfs:label ?genre.
    FILTER(LANG(?title)="en")
    FILTER(LANG(?genre)="en")    }
    """
    movies = askWikidata(queryWithOr)

    return movies["results"]["bindings"]
#director = getMovieInfoByLabel("Submarine")
#director,genre,producer,writer,artist = getMovieInfoByImdbId(ibdmId)
#movies = getWikiRecommendation(director)
def getRecommendation(imdbIds):
  
    directors,genres,producers,writers,artists =getMoviesInfo(imdbIds)
    movies = getWikiRecommendation(directors,genres,producers,writers,artists)
    return movies
