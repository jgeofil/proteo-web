nice /opt/I-TASSER3.0/I-TASSERmod/runI-TASSER.pl \
-pkgdir /opt/I-TASSER3.0 \
-libdir /opt/I-TASSER3.0/ITLIB \
-java_home /usr/lib/jvm/java-7-oracle/jre/ \
-datadir $PWD \
-tmptop $PWD/tmp \
-usrname smg \
-seqname `pwd | sed "s/\/home\/smg\/projects\/p2\/i-tasser-2\//p2_/"` > runI-TASSER.log
