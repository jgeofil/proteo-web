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
    │   │   │   ├── images                          # Images folder
    │   │   │   │   ├── [imageName1].{jpg,png}      # Image file
    │   │   │   │   ├── [imageName1].json           # Image caption and title
    │   │   │   │   ├── [imageName2].{jpg,png}      
    │   │   │   │   └── [imageName2].json           
    │   │   │   ├── disopred3                       # Disopred 3 analysis folder
    │   │   │   │   ├── disopred.seq                # Sequence file
    │   │   │   │   ├── disopred.seq.diso           # Disorder file
    │   │   │   │   └── disopred.seq.pbdat          # Protein binding file
    │   │   │   ├── i-tasser                        # I-tasser analysis folder  
    │   │   │   │   ├── cscore                      # CScore file
    │   │   │   │   ├── seq.ss                      # Secondary sequence file
    │   │   │   │   ├── coverage                    # Alignment file
    │   │   │   │   ├── model[number 1].pdb         # Model PDB file
    │   │   │   │   ├── model[number 2].pdb         
    │   │   │   │   └── ...                         # etc. more models
    │   │   │   ├── tmhmm                           # TMHMM analysis folder  
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
Metadata JSON files are formatted such as:
`
    {
    "property": "value",
    "property2": "value"
    }
`
Metadata files should always be names meta.json, except for images where they take the name of the image they refer to ([imageName].jpg <-> [imageName].json).
Date values should be in any format accepted by javascript Date().

#### Projects

  Project name is taken from project folder name.
  Available properties for metadata files are:
    - dateCreated
    - description
    - owner

#### Datasets

  Project name is taken from dataset folder name.
  Available properties for metadata files are:
    - dateCreated
    - organism

#### ORFs

  Project name is taken from ORF folder name.
  Available properties for metadata files are:
    - dateCreated
    - start
    - end
    - sysName
    - author
    - description


#### Analyses

  Available properties for metadata files are:
    - dateCreated
    - dateModified
    - author
    - other

  Other property takes a list of objects such as:
  `
    [
      {
        "name": "name of property 1",
        "value": "value for property"
      },
      {
        "name": "name of property 2",
        "value": "value for property"
      },
      ...
    ]
  `

#### Images

  Available properties for metadata files are:
    - title
    - caption
