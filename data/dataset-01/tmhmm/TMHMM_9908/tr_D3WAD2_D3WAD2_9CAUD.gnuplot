set arrow from 1,1.11 to 538,1.11 nohead lt 9 lw 10
set arrow from 539,1.09 to 561,1.09 nohead lt 1 lw 40
set arrow from 562,1.07 to 628,1.07 nohead lt 3 lw 10
set arrow from 629,1.09 to 651,1.09 nohead lt 1 lw 40
set arrow from 652,1.11 to 665,1.11 nohead lt 9 lw 10
set arrow from 666,1.09 to 688,1.09 nohead lt 1 lw 40
set arrow from 689,1.07 to 700,1.07 nohead lt 3 lw 10
set arrow from 701,1.09 to 723,1.09 nohead lt 1 lw 40
set arrow from 724,1.11 to 727,1.11 nohead lt 9 lw 10
set arrow from 728,1.09 to 750,1.09 nohead lt 1 lw 40
set arrow from 751,1.07 to 762,1.07 nohead lt 3 lw 10
set arrow from 763,1.09 to 785,1.09 nohead lt 1 lw 40
set arrow from 786,1.11 to 799,1.11 nohead lt 9 lw 10
set arrow from 800,1.09 to 822,1.09 nohead lt 1 lw 40
set arrow from 823,1.07 to 828,1.07 nohead lt 3 lw 10
set arrow from 829,1.09 to 851,1.09 nohead lt 1 lw 40
set arrow from 852,1.11 to 999,1.11 nohead lt 9 lw 10
set key below
set title "TMHMM posterior probabilities for tr|D3WAD2|D3WAD2_9CAUD Tail tape measure protein OS=Lactococcus lactis phage p2 PE=4 SV=1 ORF=14"
set yrange [0:1.2]
set size 2., 1.4
#set xlabel "position"
set ylabel "probability"
set xrange [1:999]
# Make the ps plot
set term postscript eps color solid "Helvetica" 30
set output "./TMHMM_9908/tr_D3WAD2_D3WAD2_9CAUD.eps"
plot "./TMHMM_9908/tr_D3WAD2_D3WAD2_9CAUD.plp" using 1:4 title "transmembrane" with impulses lt 1 lw 3, \
"" using 1:3 title "inside" with line lt 3 lw 4, \
"" using 1:5 title "outside" with line lt 9 lw 4
exit
