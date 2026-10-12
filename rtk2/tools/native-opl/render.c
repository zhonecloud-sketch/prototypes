#include <stdio.h>
#include <stdint.h>
#include <stdlib.h>
#include "opl3.h"
int main(int argc,char **argv){
 if(argc!=4)return 2;
 FILE* in=fopen(argv[1],"rb");FILE*out=fopen(argv[2],"wb");
 uint32_t n=strtoul(argv[3],0,10),count=0;fread(&count,4,1,in);
 uint32_t*times=malloc(count*4);uint16_t*regs=malloc(count*2);uint8_t*vals=malloc(count);
 for(uint32_t i=0;i<count;i++){fread(times+i,4,1,in);fread(regs+i,2,1,in);fread(vals+i,1,1,in);}
 opl3_chip chip;OPL3_Reset(&chip,44100);uint32_t j=0;int16_t pcm[2];
 for(uint32_t i=0;i<n;i++){
  while(j<count&&times[j]<=i){OPL3_WriteReg(&chip,regs[j],vals[j]);j++;}
  OPL3_GenerateResampled(&chip,pcm);int16_t mono=((int32_t)pcm[0]+pcm[1])/2;fwrite(&mono,2,1,out);
 }
 fclose(in);fclose(out);return 0;
}
