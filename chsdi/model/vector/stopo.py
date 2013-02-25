from chsdi.model import *

Base = declarative_base(bind=meta.engines['stopo'])

class SwissboundariesBezirk(Base, Queryable):
    # view in a schema
    __tablename__ = 'swissboundaries_bezirke'
    __table_args__ = ({'schema': 'tlm', 'autoload': True})
    __template__ = 'tooltips/swissboundaries_bezirk.mako'
    id = Column('id', Integer, primary_key=True)
    the_geom = Column(Geometry)

register('ch.swisstopo.swissboundaries3d-bezirk-flaeche.fill', SwissboundariesBezirk)

class SwissboundariesGemeinde(Base, Queryable):
    # view in a schema
    __tablename__ = 'swissboundaries_gemeinden'
    __table_args__ = ({'schema': 'tlm', 'autoload': True})
    __template__ = 'tooltips/swissboundaries_gemeinde.mako'
    id = Column('id', Integer, primary_key=True)
    the_geom = Column(Geometry)

register('ch.swisstopo.swissboundaries3d-gemeinde-flaeche.fill', SwissboundariesGemeinde)

class SwissboundariesKanton(Base, Queryable):
    # view in a schema
    __tablename__ = 'swissboundaries_kantone'
    __table_args__ = ({'schema': 'tlm', 'autoload': True})
    __template__ = 'tooltips/swissboundaries_kanton.mako'
    id = Column('kantonsnr', Integer, primary_key=True)
    the_geom = Column(Geometry)

register('ch.swisstopo.swissboundaries3d-kanton-flaeche.fill', SwissboundariesKanton)

# These two layers do not have a table on their own
class CadastralWebMap(Base, Queryable):
    __tablename__ = 'kantone25plus'
    __table_args__ = ({'autoload': True})
    __template__ = 'tooltips/cadastralwebmap.mako'
    id = Column('gid', Integer, primary_key=True)
    the_geom = Column(Geometry)
register('ch.kantone.cadastralwebmap-farbe', CadastralWebMap)


class Vec200Terminal(Base, Queryable):
    __tablename__ = 'vec200_terminal_tiles'
    __table_args__ = ({'autoload': True})
    __template__ = 'tooltips/vec200_terminal.mako'
    id = Column('gtdboid', Text, primary_key=True)
    the_geom = Column(Geometry)

class Vec200ShipKursschiff(Base, Queryable):
    __tablename__ = 'v200_ship_kursschiff_linie_tooltip'
    __table_args__ = ({'autoload': True})
    __template__ = 'tooltips/vec200_ship_kursschiff_linie.mako'
    id = Column('gtdboid', Text, primary_key=True)
    the_geom = Column(Geometry(21781))

class Vec200Runway(Base, Queryable):
    __tablename__ = 'vec200_runway'
    __table_args__ = ({'autoload': True})
    __template__ = 'tooltips/vec200_runway.mako'
    id = Column('gtdboid', Text, primary_key=True)
    the_geom = Column(Geometry)

class Vec200Railway(Base, Queryable):
    __tablename__ = 'vec200_railway_tiles'
    __table_args__ = ({'autoload': True})
    __template__ = 'tooltips/vec200_railway.mako'
    id = Column('gtdboid', Text, primary_key=True)
    the_geom = Column(Geometry)

class Vec200Airport(Base, Queryable):
    __tablename__ = 'vec200_airport'
    __table_args__ = ({'autoload': True})
    __template__ = 'tooltips/vec200_airport.mako'
    id = Column('gtdboid', Text, primary_key=True)
    the_geom = Column(Geometry)

register('ch.swisstopo.vec200-transportation-oeffentliche-verkehr', Vec200Terminal)
register('ch.swisstopo.vec200-transportation-oeffentliche-verkehr', Vec200ShipKursschiff)
register('ch.swisstopo.vec200-transportation-oeffentliche-verkehr', Vec200Railway)

class treasurehunt(Base, Queryable):
    __tablename__ = 'treasurehunt'
    __table_args__ = ({'schema': 'public', 'autoload': True})
    __template__ = 'tooltips/treasurehunt.mako'
    __maxscale__ = 2505
    id = Column('bgdi_id', Text, primary_key=True)
    the_geom = Column(Geometry)

register('ch.swisstopo.treasurehunt', treasurehunt)

class Vec200Trafficinfo(Base, Queryable):
    __tablename__ = 'vec200_trafficinfo_tiles'
    __table_args__ = ({'autoload': True})
    __template__ = 'tooltips/vec200_trafficinfo.mako'
    id = Column('gtdboid', Text, primary_key=True)
    the_geom = Column(Geometry)

class Vec200ShipAutofaehre(Base, Queryable):
    __tablename__ = 'v200_ship_autofaehre_tooltip'
    __table_args__ = ({'autoload': True})
    __template__ = 'tooltips/vec200_ship_autofaehre.mako'
    id = Column('gtdboid', Text, primary_key=True)
    the_geom = Column(Geometry)

class Vec200Road(Base, Queryable):
    __tablename__ = 'vec200_road_tiles'
    __table_args__ = ({'autoload': True})
    __template__ = 'tooltips/vec200_road.mako'
    id = Column('gtdboid', Text, primary_key=True)
    the_geom = Column(Geometry)

class Vec200Ramp(Base, Queryable):
    __tablename__ = 'vec200_ramp_tiles'
    __table_args__ = ({'autoload': True})
    __template__ = 'tooltips/vec200_ramp.mako'
    id = Column('gtdboid', Text, primary_key=True)
    the_geom = Column(Geometry)

class Vec200Interchange(Base, Queryable):
    __tablename__ = 'vec200_interchange'
    __table_args__ = ({'autoload': True})
    __template__ = 'tooltips/vec200_interchange.mako'
    id = Column('gtdboid', Text, primary_key=True)
    the_geom = Column(Geometry)

class Vec200Customsoffice(Base, Queryable):
    __tablename__ = 'vec200_customsoffice_tiles'
    __table_args__ = ({'autoload': True})
    __template__ = 'tooltips/vec200_customsoffice.mako'
    id = Column('gtdboid', Text, primary_key=True)
    the_geom = Column(Geometry)

register('ch.swisstopo.vec200-transportation-strassennetz', Vec200Trafficinfo)
register('ch.swisstopo.vec200-transportation-strassennetz', Vec200ShipAutofaehre)
register('ch.swisstopo.vec200-transportation-strassennetz', Vec200Road)
register('ch.swisstopo.vec200-transportation-strassennetz', Vec200Ramp)
register('ch.swisstopo.vec200-transportation-strassennetz', Vec200Customsoffice)

class Vec200Protectedarea(Base, Queryable):
    __tablename__ = 'vec200_protectedarea'
    __table_args__ = ({'autoload': True})
    __template__ = 'tooltips/vec200_protectedarea.mako'
    id = Column('gtdboid', Text, primary_key=True)
    the_geom = Column(Geometry)

register('ch.swisstopo.vec200-adminboundaries-protectedarea', Vec200Protectedarea)

class Vec200Flowingwater(Base, Queryable):
    __tablename__ = 'vec200_flowingwater'
    __table_args__ = ({'autoload': True})
    __template__ = 'tooltips/vec200_flowingwater.mako'
    id = Column('gtdboid', Text, primary_key=True)
    the_geom = Column(Geometry)

class Vec200Stagnantwater(Base, Queryable):
    __tablename__ = 'vec200_stagnantwater'
    __table_args__ = ({'autoload': True})
    __template__ = 'tooltips/vec200_stagnantwater.mako'
    id = Column('gtdboid', Text, primary_key=True)
    the_geom = Column(Geometry)

register('ch.swisstopo.vec200-hydrography', Vec200Flowingwater)
register('ch.swisstopo.vec200-hydrography', Vec200Stagnantwater)

class Vec200Landcover(Base, Queryable):
    __tablename__ = 'vec200_landcover'
    __table_args__ = ({'autoload': True})
    __template__ = 'tooltips/vec200_landcover.mako'
    id = Column('gtdboid', Text, primary_key=True)
    the_geom = Column(Geometry)

register('ch.swisstopo.vec200-landcover', Vec200Landcover)

class Vec200Builtupp(Base, Queryable):
    __tablename__ = 'vec200_builtupp'
    __table_args__ = ({'autoload': True})
    __template__ = 'tooltips/vec200_builtupp.mako'
    id = Column('gtdboid', Text, primary_key=True)
    the_geom = Column(Geometry)

class Vec200Poi(Base, Queryable):
    __tablename__ = 'v200_poi_tooltip'
    __table_args__ = ({'autoload': True})
    __template__ = 'tooltips/vec200_poi.mako'
    id = Column('gtdboid', Text, primary_key=True)
    the_geom = Column(Geometry)

class Vec200Supply(Base, Queryable):
    __tablename__ = 'vec200_supply'
    __table_args__ = ({'autoload': True})
    __template__ = 'tooltips/vec200_supply.mako'
    id = Column('gtdboid', Text, primary_key=True)
    the_geom = Column(Geometry)

register('ch.swisstopo.vec200-miscellaneous', Vec200Builtupp)
register('ch.swisstopo.vec200-miscellaneous', Vec200Poi)
register('ch.swisstopo.vec200-miscellaneous', Vec200Supply)

class Vec200Namedlocation(Base, Queryable):
    __tablename__ = 'vec200_namedlocation'
    __table_args__ = ({'autoload': True})
    __template__ = 'tooltips/vec200_namedlocation.mako'
    id = Column('gtdboid', Text, primary_key=True)
    the_geom = Column(Geometry)

register('ch.swisstopo.vec200-names-namedlocation', Vec200Namedlocation)

class Vec25Strassennetz(Base, Queryable):
 	__tablename__ = 'v25_str_25_l_tooltip'
 	__table_args__ = ({'autoload': True})
 	__template__ = 'tooltips/vec25_strassennetz.mako'
 	id = Column('objectid', Integer, primary_key=True)
 	the_geom = Column(Geometry)

register('ch.swisstopo.vec25-strassennetz', Vec25Strassennetz)

class Vec25Uebrige(Base, Queryable):
 	__tablename__ = 'v25_uvk_25_l'
 	__table_args__ = ({'autoload': True})
 	__template__ = 'tooltips/vec25_uebrigeverk.mako'
 	id = Column('objectid', Integer, primary_key=True)
 	the_geom = Column(Geometry)

register('ch.swisstopo.vec25-uebrigerverkehr', Vec25Uebrige)

class Vec25Anlagen(Base, Queryable):
 	__tablename__ = 'v25_anl_25_a'
 	__table_args__ = ({'autoload': True})
 	__template__ = 'tooltips/vec25_anlagen.mako'
 	id = Column('objectid', Integer, primary_key=True)
 	the_geom = Column(Geometry)

register('ch.swisstopo.vec25-anlagen', Vec25Anlagen)

class Vec25Eisenbahnnetz(Base, Queryable):
 	__tablename__ = 'v25_eis_25_l'
 	__table_args__ = ({'autoload': True})
 	__template__ = 'tooltips/vec25_eisenbahnnetz.mako'
 	id = Column('objectid', Integer, primary_key=True)
 	the_geom = Column(Geometry)

register('ch.swisstopo.vec25-eisenbahnnetz', Vec25Eisenbahnnetz)

class Vec25Gebaeude(Base, Queryable):
 	__tablename__ = 'v25_geb_25_a'
 	__table_args__ = ({'autoload': True})
 	__template__ = 'tooltips/vec25_gebaeude.mako'
 	id = Column('objectid', Integer, primary_key=True)
 	the_geom = Column(Geometry)

register('ch.swisstopo.vec25-gebaeude', Vec25Gebaeude)

class Vec25Gewaessernetz(Base, Queryable):
 	__tablename__ = 'v25_gwn_25_l'
 	__table_args__ = ({'autoload': True})
 	__template__ = 'tooltips/vec25_gewaessernetz.mako'
 	id = Column('objectid', Integer, primary_key=True)
 	the_geom = Column(Geometry)

register('ch.swisstopo.vec25-gewaessernetz', Vec25Gewaessernetz)

class Vec25Primaerflaechen(Base, Queryable):
 	__tablename__ = 'v25_pri25_a'
 	__table_args__ = ({'autoload': True})
 	__template__ = 'tooltips/vec25_primaerflaechen.mako'
 	id = Column('objectid', Integer, primary_key=True)
 	the_geom = Column(Geometry)

register('ch.swisstopo.vec25-primaerflaechen', Vec25Primaerflaechen)

class Vec25Einzelobjekte(Base, Queryable):
 	__tablename__ = 'v25_eob_25_l'
 	__table_args__ = ({'autoload': True})
 	__template__ = 'tooltips/vec25_einzelobjekte.mako'
 	id = Column('objectid', Integer, primary_key=True)
 	the_geom = Column(Geometry)

register('ch.swisstopo.vec25-einzelobjekte', Vec25Einzelobjekte)

class Vec25Heckenbaeume(Base, Queryable):
 	__tablename__ = 'v25_heb_25_l'
 	__table_args__ = ({'autoload': True})
 	__template__ = 'tooltips/vec25_heckenbaeume.mako'
 	id = Column('objectid', Integer, primary_key=True)
 	the_geom = Column(Geometry)

register('ch.swisstopo.vec25-heckenbaeume', Vec25Heckenbaeume)

class Dreiecksvermaschung(Base, Queryable):
        # view in a schema
        __tablename__ = 'dreiecksvermaschung'
        __table_args__ = ({'schema': 'geodaesie', 'autoload': True})
        __template__ = 'tooltips/dreiecksvermaschung.mako'
        id = Column('bgdi_id', Integer, primary_key=True)
        the_geom = Column(Geometry(21781))

register('ch.swisstopo.dreiecksvermaschung',Dreiecksvermaschung)

class DufourErst(Base, Queryable):
 	# view in a schema
 	__tablename__ = 'view_gridstand_datenhaltung_dufour_erst'
 	__table_args__ = ({'schema': 'datenstand', 'autoload': True})
 	__template__ = 'tooltips/dufour_erst.mako'
 	id = Column('tilenumber', Text, primary_key=True)
 	tilenumber = column_property(id)
 	the_geom = Column(Geometry(21781))

register('ch.swisstopo.hiks-dufour',DufourErst)

class SiegfriedErst(Base, Queryable):
 	# view in a schema
 	__tablename__ = 'view_gridstand_datenhaltung_siegfried_erst'
 	__table_args__ = ({'schema': 'datenstand', 'autoload': True})
 	__template__ = 'tooltips/siegfried_erst.mako'
 	id = Column('tilenumber', Text, primary_key=True)
 	tilenumber = column_property(id)
 	the_geom = Column(Geometry(21781))

register('ch.swisstopo.hiks-siegfried',SiegfriedErst)

class GridstandPk25(Base, Queryable):
 	# view in a schema
 	__tablename__ = 'view_gridstand_datenhaltung_pk25_tilecache'
 	__table_args__ = ({'schema': 'datenstand', 'autoload': True})
 	__template__ = 'tooltips/pk25_metadata.mako'
 	id = Column('kbnum', Text, primary_key=True)
 	the_geom = Column(Geometry(21781))

register('ch.swisstopo.pixelkarte-pk25.metadata',GridstandPk25)
register('ch.swisstopo.pixelkarte-farbe-pk25.noscale',GridstandPk25)

class GridstandPk50(Base, Queryable):
 	# view in a schema
 	__tablename__ = 'view_gridstand_datenhaltung_pk50_tilecache'
 	__table_args__ = ({'schema': 'datenstand', 'autoload': True})
 	__template__ = 'tooltips/pk50_metadata.mako'
 	id = Column('kbnum', Text, primary_key=True)
 	the_geom = Column(Geometry(21781))

register('ch.swisstopo.pixelkarte-pk50.metadata',GridstandPk50)
register('ch.swisstopo.pixelkarte-farbe-pk50.noscale',GridstandPk50)

class GridstandPk100(Base, Queryable):
 	# view in a schema
 	__tablename__ = 'view_gridstand_datenhaltung_pk100_tilecache'
 	__table_args__ = ({'schema': 'datenstand', 'autoload': True})
 	__template__ = 'tooltips/pk100_metadata.mako'
 	id = Column('kbnum', Text, primary_key=True)
 	the_geom = Column(Geometry(21781))

register('ch.swisstopo.pixelkarte-pk100.metadata',GridstandPk100)
register('ch.swisstopo.pixelkarte-farbe-pk100.noscale',GridstandPk100)

class GridstandPk200(Base, Queryable):
 	# view in a schema
 	__tablename__ = 'view_gridstand_datenhaltung_pk200_tilecache'
 	__table_args__ = ({'schema': 'datenstand', 'autoload': True})
 	__template__ = 'tooltips/pk200_metadata.mako'
 	id = Column('kbnum', Text, primary_key=True)
 	the_geom = Column(Geometry(21781))

register('ch.swisstopo.pixelkarte-pk200.metadata',GridstandPk200)
register('ch.swisstopo.pixelkarte-farbe-pk200.noscale',GridstandPk200)

class GridstandPk500(Base, Queryable):
 	# view in a schema
 	__tablename__ = 'view_gridstand_datenhaltung_pk500_tilecache'
 	__table_args__ = ({'schema': 'datenstand', 'autoload': True})
 	__template__ = 'tooltips/pk500_metadata.mako'
 	id = Column('kbnum', Text, primary_key=True)
 	the_geom = Column(Geometry(21781))

register('ch.swisstopo.pixelkarte-pk500.metadata',GridstandPk500)
register('ch.swisstopo.pixelkarte-farbe-pk500.noscale',GridstandPk500)

class GridstandSwissimage(Base, Queryable):
 	# view in a schema
 	__tablename__ = 'view_gridstand_datenhaltung_swissimage_tilecache'
 	__table_args__ = ({'schema': 'datenstand', 'autoload': True})
 	__template__ = 'tooltips/images_metadata.mako'
 	id = Column('tilenumber', Text, primary_key=True)
 	the_geom = Column(Geometry(21781))

register('ch.swisstopo.images-swissimage.metadata',GridstandSwissimage)

class GeologischerAtlasPK(Base, Queryable):
 	# view in a schema
 	__tablename__ = 'kv_ga25_pk'
 	__table_args__ = ({'schema': 'geol', 'autoload': True})
 	__template__ = 'tooltips/geol_ga_pk.mako'
 	id = Column('nr', Text, primary_key=True)
 	the_geom = Column(Geometry(21781))

register('ch.swisstopo.geologie-geologischer_atlas',GeologischerAtlasPK)

class GeologieMineralischeRohstoffe200(Base, Queryable):
        # view in a schema
        __tablename__ = 'geotechnik_mineralische_rohstoffe200'
        __table_args__ = ({'schema': 'geol', 'autoload': True})
        __template__ = 'tooltips/geotechnik_mineralische_rohstoffe200.mako'
        id = Column('bgdi_id', Integer, primary_key=True)
        the_geom = Column(Geometry(21781))

register('ch.swisstopo.geologie-geotechnik-mineralische_rohstoffe200',GeologieMineralischeRohstoffe200)

class GeologieGeotechnikGk200(Base, Queryable):
        # view in a schema
        __tablename__ = 'geotechnik_gk200_lgd'
        __table_args__ = ({'schema': 'geol', 'autoload': True})
        __template__ = 'tooltips/geotechnik_gk200.mako'
        id = Column('bgdi_id', Integer, primary_key=True)
        the_geom = Column(Geometry(21781))

register('ch.swisstopo.geologie-geotechnik-gk200',GeologieGeotechnikGk200)

class Gk500_lithologie_hauptgruppen(Base, Queryable):
        # view in a schema
        __tablename__ = 'gk500_lithologie_hauptgruppen'
        __table_args__ = ({'schema': 'geol', 'autoload': True})
        __template__ = 'tooltips/lithologie_hauptgruppen.mako'
        id = Column('bgdi_id', Integer, primary_key=True)
        the_geom = Column(Geometry(21781))

register('ch.swisstopo.geologie-geotechnik-gk500-lithologie_hauptgruppen',Gk500_lithologie_hauptgruppen)

class Geologischer_Inklination(Base, Queryable):
        # view in a schema
        __tablename__ = 'geophysik_inklination'
        __table_args__ = ({'schema': 'geol', 'autoload': True})
        __template__ = 'tooltips/inklination.mako'
        id = Column('gid', Integer, primary_key=True)
        the_geom = Column(Geometry(21781))

register('ch.swisstopo.geologie-geophysik-inklination',Geologischer_Inklination)

class Geologischer_Aeromagnetik_Jura(Base, Queryable):
        # view in a schema
        __tablename__ = 'gravimetrie_aeromagnetik_jura'
        __table_args__ = ({'schema': 'geol', 'autoload': True})
        __template__ = 'tooltips/aeromagnetik_jura.mako'
        id = Column('gid', Integer, primary_key=True)
        fid = Column ('id', Integer)
        the_geom = Column(Geometry(21781))

register('ch.swisstopo.geologie-geophysik-aeromagnetische_karte_jura',Geologischer_Aeromagnetik_Jura)

class SwissmapOnlineWanderwege(Base, Queryable):
 	# view in a schema
 	__tablename__ = 'wanderwege_swissmap'
 	__table_args__ = ({'schema': 'karto', 'autoload': True})
 	__template__ = 'tooltips/swissmap_online_wanderwege.mako'
 	id = Column('nr', Integer, primary_key=True)
 	the_geom = Column(Geometry(21781))

register('ch.swisstopo-karto.wanderwege',SwissmapOnlineWanderwege)

class PLZOrtschaften(Base, Queryable):
       # view in a schema
       __tablename__ = 'gabmo_plz'
       __table_args__ = ({'schema': 'vd', 'autoload': False})
       __template__ = 'tooltips/gabmo_plz.mako'
       id = Column('os_uuid', Text, primary_key=True)
       plz = Column('plz', Integer)
       zusziff = Column('zusziff', Text)
       langtext = Column('langtext', Text)
       the_geom = Column(Geometry(21781))

register('ch.swisstopo-vd.ortschaftenverzeichnis_plz',PLZOrtschaften)

class geometaStandAV(Base, Queryable): 	 
       # view in a schema 	 
       __tablename__ = 'amogr_standav' 	 
       __table_args__ = ({'schema': 'vd', 'autoload': True}) 	 
       __template__ = 'tooltips/standav.mako' 	 
       id = Column('gid', Integer, primary_key=True) 	 
       fid = Column ('id', Integer) 	 
       the_geom = Column('the_geom_gen50',Geometry(21781)) 	 
       not_used = Column('the_geom',Geometry(21781)) 	 
	  	 
register('ch.swisstopo-vd.geometa-standav',geometaStandAV)

class geometaLos(Base, Queryable):
       # view in a schema
       __tablename__ = 'amogr_los'
       __table_args__ = ({'schema': 'vd', 'autoload': True})
       __template__ = 'tooltips/los.mako'
       id = Column('gid', Integer, primary_key=True)
       fid = Column ('id', Integer)
       the_geom = Column('the_geom_gen50',Geometry(21781))
       not_used = Column('the_geom',Geometry(21781))

register('ch.swisstopo-vd.geometa-los',geometaLos)

class geometaGemeinde(Base, Queryable):
       # view in a schema
       __tablename__ = 'amogr_gemeinde'
       __table_args__ = ({'schema': 'vd', 'autoload': True})
       __template__ = 'tooltips/gemeinde.mako'
       id = Column('gid', Integer, primary_key=True)
       fid = Column ('id', Integer)
#       gembfs = Column ('bfs_nr', Integer)
#       gemkanton = Column ('kanton', Text)
#       gemgemeinde = Column ('gemeindename', Text)
#       gemdarstellung = Column ('abgabestelle', Text)
#       gemflaeche = Column ('flaeche_ha', Text)
#       geompdf_liste = Column ('pdf_liste', Text)
       the_geom = Column('the_geom_gen50',Geometry(21781))
       not_used = Column('the_geom',Geometry(21781))

register('ch.swisstopo-vd.geometa-gemeinde',geometaGemeinde)

class geometaGrundbuch(Base, Queryable):
       # view in a schema
       __tablename__ = 'amogr_grundbuch'
       __table_args__ = ({'schema': 'vd', 'autoload': True})
       __template__ = 'tooltips/grundbuch.mako'
       id = Column('gid', Integer, primary_key=True)
       fid = Column ('id', Integer)
#       grundgemeinde = Column ('ortsteil_grundbuch', Text)
#       grundfuehrung = Column ('grundbuchfuehrung_d', Text)
#       grundkreis = Column ('grundbuchkreis', Text)
#       grundadresse = Column ('adresse', Text)
#       grundtel = Column ('telefon', Text)
#       grundurl = Column ('email', Text)
       the_geom = Column('the_geom_gen50',Geometry(21781))
       not_used = Column('the_geom',Geometry(21781))

register('ch.swisstopo-vd.geometa-grundbuch',geometaGrundbuch)

class geometaNfgeom(Base, Queryable):
       # view in a schema
       __tablename__ = 'amogr_nfgeom'
       __table_args__ = ({'schema': 'vd', 'autoload': True})
       __template__ = 'tooltips/nfgeom.mako'
       id = Column('gid', Integer, primary_key=True)
#       nfname = Column ('name', Text)
#       nffirmenname = Column ('firmenname', Text)
#       nfadresse = Column ('adresse', Text)
       the_geom = Column('the_geom_gen50',Geometry(21781))
       not_used = Column('the_geom',Geometry(21781))

register('ch.swisstopo-vd.geometa-nfgeom',geometaNfgeom)

class spannungsarmeGebiete(Base, Queryable):
       __tablename__ = 'spannungsarme_gebiete'
       __table_args__ = ({'schema': 'vd', 'autoload': True})
       __template__ = 'tooltips/spannungsarme_gebiete.mako'
       id = Column('identifier', Text, primary_key=True)
       the_geom = Column(Geometry(21781))

register('ch.swisstopo-vd.spannungsarme-gebiete',spannungsarmeGebiete)
register('ch.swisstopo.transformationsgenauigkeit',spannungsarmeGebiete)

class geologieGeotopePunkte(Base, Queryable):
     __tablename__ = 'geotope_punkte'
     __table_args__ = ({'schema': 'geol', 'autoload': True})
     __template__ = 'tooltips/geotope.mako'
     id = Column('gid', Integer, primary_key=True)
     the_geom = Column(Geometry(21781))

     code = Column('code', Text)
     nom = Column('nom', Text)

class geologieGeotopeFlaechen(Base, Queryable):
     __tablename__ = 'geotope_flaechen'
     __table_args__ = ({'schema': 'geol', 'autoload': True})
     __template__ = 'tooltips/geotope.mako'
     id = Column('gid', Integer, primary_key=True)
     the_geom = Column(Geometry(21781))
     
     code = Column('code', Text)
     nom = Column('nom', Text)

register('ch.swisstopo.geologie-geotope',geologieGeotopePunkte)
register('ch.swisstopo.geologie-geotope',geologieGeotopeFlaechen)
