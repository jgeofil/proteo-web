set arrow from 1,1.11 to 104,1.11 nohead lt 9 lw 10
set key below
set title "TMHMM posterior probabilities for tr|D3WAC7|D3WAC7_9CAUD Structural protein OS=Lactococcus lactis phage p2 PE=4 SV=1 ORF=8"
set yrange [0:1.2]
set size 2., 1.4
#set xlabel "position"
set ylabel "probability"
set xrange [1:104]
# Make the ps plot
set term postscript eps color solid "Helvetica" 30
set output "./TMHMM_9908/tr_D3WAC7_D3WAC7_9CAUD.eps"
plot "./TMHMM_9908/tr_D3WAC7_D3WAC7_9CAUD.plp" using 1:4 title "transmembrane" with impulses lt 1 lw 3, \
"" using 1:3 title "inside" with line lt 3 lw 4, \
"" using 1:5 title "outside" with line lt 9 lw 4
exit
