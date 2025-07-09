# This site based on [The Digital Arc platform Jekyll Theme]([https://digital.kalanicraig.com/](http://digitalarcplatform.kalanicraig.com))

[![LICENSE](https://img.shields.io/badge/license-CC%20BY--NC--SA%204.0-blue)](https://raw.githubusercontent.com/kalanicraig/community-archive/main/LICENSE)
[![Jekyll](https://img.shields.io/badge/jekyll-%3E%3D%203.7-blue.svg)](https://jekyllrb.com/)

This site uses custom code in place of the original DigitalArc files in the following locations:
- _data
	- metadata.yml Customized the metadata display for bilingual Italian/English and added several fields for use in inventory list.
- _layouts/
	- item.html Added "static_file.path contains 'subitem'" to "static_file.path contains 'transcript'" line.
- _includes/
	- _itembox.html Customize the list of metadata that shows in the itemlist (inc remove item contribut metadata field). Make item boxes smaller.
- _sass
	- colors
		- _accent-custom.scss
		- _custom.scss
		- _whitewithaccent.scss
	- fonts
		- _custom.scss

## Dublin Core and other fields in the inventory dataset
- Identifier: a standard unique identifier from MTD
- Type: Types at https://www.dublincore.org/specifications/dublin-core/dcmi-type-vocabulary/ are less useful for this collection so these aren't from the DCMI
- Collection: Defines the 
- Relation: Generally used in the "IsPartOf" Dublin Core model
- RecordNo: Sub-element of Identifier. Used to build Identifier.
- StoredIn: Adapted from StoredInDisplay but used for document sorting purposes. Sub-element of Identifier. Used to build Identifier. 
- StoredInDisplay: Shelfmark or BoxNo displayed to user
- Title
- Creator
- Author
- Location
- DateStart
- DateEnd
- Temporal: Display date for ease of user understanding
- Description: Misc information, notes, other descriptive information
- RevisionRequired: Record needs to be cleaned up
- Format: Includes dimensions; Can also include materials (e.g. parchment, ink)
- CEIOA: from the MTD collection info	
- MiBACT1998: From the MTD collection info	
- Rights: Almost always "Fondazione del Tesoro del Museo del Duomo e Archivio Capitolare"

## Credits

### Partners

- [Institute for Digital Arts & Humanities](https://idah.indiana.edu), Indiana University–Bloomington
- [Center for Research on Race, Ethnicity and Society](https://crres.indiana.edu), Indiana University–Bloomington
- [ImaginX en Movimiento (IXeM)](https://www.instagram.com/ixemcollective/?hl=en)
- The [Remembering Freedom](https://longtownhistory.github.io/) descendant community in Greenville and Longtown, Ohio, and Dr. Jazma Sutton

### Technical Resources

- [Github](http://github.com/)
- [Jekyll](http://jekyllrb.com/)
- [Foundation](http://foundation.zurb.com/)
- [Font Awesome](http://fontawesome.io/)
- [Google Fonts](http://fonts.google.com/)
- [Coolors](https://coolors.co)
- [Minimal Mistakes Jekyll Theme](https://mmistakes.github.io/minimal-mistakes/)
- [Shields.io](https://shields.io/category/coverage)
