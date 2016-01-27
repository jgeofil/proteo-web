# proteo-web

## Installation

### Prerequisites

- [Git](https://git-scm.com/)
- [Node.js and npm](nodejs.org) Node ^4.2.3, npm ^2.14.7
- [Bower](bower.io) (`npm install --global bower`)
- [Grunt](http://gruntjs.com/) (`npm install --global grunt-cli`)
- [MongoDB](https://www.mongodb.org/) - Keep a running daemon with `mongod`

### Developing

1. Run `npm install` to install server dependencies.

2. Run `bower install` to install front-end dependencies.

3. Run `mongod` in a separate shell to keep an instance of the MongoDB Daemon running

4. Run `grunt serve` to start the development server. It should automatically open the client in your browser when ready.

### Build & development

Run `grunt build` for building and `grunt serve` for preview.

### Testing

Running `npm test` will run the unit tests with karma.

## Data

### Structure

    .
    ├── [dataset name 1]                        # Dataset folder, name is arbitrary but must be unique  
    │   ├── [orf name 1]                        # ORF folder, name is arbitrary but must be unique
    │   │   ├── disopred3                       # Disopred 3 analysis folder
    │   │   │   ├── [orf name 1].seq            # Sequence file
    │   │   │   ├── [orf name 1].seq.diso       # Disorder file
    │   │   │   └── [orf name 1].seq.pbdat      # Protein binding file
    │   │   └── i-tasser                        # I-tasser analysis folder  
    │   │       ├── cscore                      # CScore file
    │   │       ├── seq.ss                      # Secondary sequence file
    │   │       ├── coverage                    # Alignment file
    │   │       ├── model[number 1].pdb         # Model PDB file
    │   │       ├── model[number 2].pdb         
    │   │       └── ...                         # etc. more models
    │   ├── [orf name 2]        
    │   └── ...                                 # etc. more ORFs
    ├── [dataset name 2]
    └── ...                                     # etc. more datasets

## API

### Datasets

`GET /api/data` 
Returns list of available datasets.

### ORFs

`GET /api/data/[dataset name]/orf`

Returns list of available ORFs in selected dataset.

### Analysis

`GET /api/data/[dataset name]/orf/[orf name]/analysis` 

Returns list of available analysis results for selected ORF.

#### Disopred 3

`GET /api/data/[dataset name]/orf/[orf name]/analysis/disopred3/` 

Returns JSON formatted disopred output

#### I-Tasser

`GET /api/data/[dataset name]/orf/[orf name]/analysis/itasser/models` 

Returns list of available model files

`GET /api/data/[dataset name]/orf/[orf name]/analysis/itasser/models/[modelName]` 

Returns PDB file of selected model

`GET /api/data/[dataset name]/orf/[orf name]/analysis/itasser/predictions` 

Returns JSON formatted i-tasser output
