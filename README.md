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
    ├── [project name 1]                            # Project folder, name is arbitrary but must be unique
    │   ├── meta.json                               # Metadata file describing project
    │   ├── [dataset name 1]                        # Dataset folder, name is arbitrary but must be unique
    │   │   ├── meta.json                           # Metadata file describing dataset
    │   │   ├── [orf name 1]                        # ORF folder, name is arbitrary but must be unique
    │   │   │   ├── meta.json                       # Metadata file describing ORF
    │   │   │   ├── disopred3                       # Disopred 3 analysis folder
    │   │   │   │   ├── disopred.seq                # Sequence file
    │   │   │   │   ├── disopred.seq.diso           # Disorder file
    │   │   │   │   └── disopred.seq.pbdat          # Protein binding file
    │   │   │   └── i-tasser                        # I-tasser analysis folder  
    │   │   │   │   ├── cscore                      # CScore file
    │   │   │   │   ├── seq.ss                      # Secondary sequence file
    │   │   │   │   ├── coverage                    # Alignment file
    │   │   │   │   ├── model[number 1].pdb         # Model PDB file
    │   │   │   │   ├── model[number 2].pdb         
    │   │   │   │   └── ...                         # etc. more models
    │   │   │   └── tmhmm                           # TMHMM analysis folder  
    │   │   │   │   ├── tmhmm.long                  # Secondary sequence file
    │   │   │   │   └── tmhmm.plp                   # PLP file
    │   │   │   └── topcons                         # TOPCONS analysis folder  
    │   │   │       └── topcons.txt                 # TOPCONS data file
    │   │   ├── [orf name 2]        
    │   │   └── ...                                 # etc. more ORFs
    │   ├── [dataset name 2]
    │   └── ...                                     # etc. more datasets
    └── ...                                         # etc. more projects

### Metadata

Metadata files for Datasets and ORFs are formatted such as:

`
    {
    "dateCreated": "06-06-15",
    "organism": "phage"
    }
`
`
{
	"dateCreated": "06-06-15",
	"start": 45,
	"end": 456
}
`
