nice /opt/I-TASSER3.0/I-TASSERmod/runLOMETS.pl \
-libdir /opt/I-TASSER3.0/ITLIB \
-java_home /usr/lib/jvm/java-7-oracle/jre/ \
-datadir $PWD \
-tmptop $PWD/tmp \
-usrname smg \
-seqname `pwd | sed "s/\/home\/smg\/projects\/p2\/lomets-3\//p2_/"` > runLOMETS.log
