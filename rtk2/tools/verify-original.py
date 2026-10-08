"""Static v15 checks on supplied packed English main.exe and scenario.dat.
Unpacks the binary's own backwards RLE stream in memory. Does not execute DOS,
modify inputs or redistribute executable bytes. Offsets are unpacked load-image offsets.
"""
import argparse, hashlib, json, struct
from pathlib import Path
EXPECTED='25f92228309660160cbd6b5cd55098b26b8ece266899aa9f262848c017b1efd8'
def unpack(data):
    header=struct.unpack_from('<14H',data)
    assert header[0]==0x5a4d and header[3]==0
    packed=data[header[4]*16:];stub=header[11]*16
    assert packed[stub+14:stub+16]==b'RB'
    end=struct.unpack_from('<H',packed,stub+12)[0]*16
    output=bytearray(end);src,dst,blocks=stub-1,end-1,0
    while packed[src]==255:src-=1
    while True:
        opcode=packed[src];count=struct.unpack_from('<H',packed,src-2)[0];src-=3;blocks+=1
        assert count<=dst+1
        if opcode in [0xb0,0xb1]:output[dst-count+1:dst+1]=bytes([packed[src]])*count;src-=1
        elif opcode in [0xb2,0xb3]:
            assert count<=src+1
            output[dst-count+1:dst+1]=packed[src-count+1:src+1];src-=count
        else:raise ValueError('Unsupported original packing block')
        dst-=count
        if opcode&1:break
    assert src==dst
    output[:src+1]=packed[:src+1]
    return output,blocks
def main():
    parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('inputs',type=Path);parser.add_argument('output',type=Path);args=parser.parse_args()
    data=(args.inputs/'main.exe').read_bytes();sha=hashlib.sha256(data).hexdigest()
    assert sha==EXPECTED,'This verifier applies to the supplied English binary only.'
    image,blocks=unpack(data)
    checks={
      'rival_requires_two_ready_officers':(0x180a8,'9a8e008a123c027309'),
      'rival_first_messenger_selection':(0x17f6e,'ff76060ee8bfff83c4028946fe'),
      'rival_second_messenger_selection':(0x17f8b,'ff76080ee8a2ff83c4028946fc'),
      'rival_first_journey':(0x1803d,'9a98103011'),
      'rival_second_journey':(0x18086,'9a98103011'),
      'attack_menu_dispatch':(0x26652,'a0d6b82ae448740a48741b48487429'),
      'defender_defeat_status':(0x24c12,'8b5e08a1c8b839471273072ac0'),
      'charge_terminal_branch':(0x26438,'807efc01750e'),
      'charge_defeated_tile_coordinates':(0x2644c,'8a460a508a4e0851ff76fe9a48005722'),
      'charge_defeated_tile_occupancy':(0x2645f,'8a460a508a4608508a46f0508a46f4509a36053323'),
      'charge_breakthrough_war_test':(0x26503,'8b5efe8a4705509adc007c05'),
      'percentage_test':(0x58aa,'3a46067205'),
      'marriage_no_daughter_flag':(0x16f06,'8b1e9433f6470702741cb8e376'),
      'marriage_already_married':(0x16f2c,'807f21ff7406b8f976'),
      'marriage_outgoing_partner_write':(0x10ad6,'8b1e9433884721'),
      'marriage_incoming_partner_write':(0x10b85,'8b1e9433884720'),
      'dead_spouse_daughter_retirement':(0x7f84,'c64721ff8b1ed0408b1f804f0702')}
    for name,(offset,hexbytes) in checks.items():
        expected=bytes.fromhex(hexbytes);assert image[offset:offset+len(expected)]==expected,name
    scenario=(args.inputs/'scenario.dat').read_bytes();ptr=struct.unpack_from('<H',scenario,0x2dc4-0x42+3*35+2)[0];names=[]
    while ptr:
        at=ptr-0x42;names.append(scenario[at+28:at+41].split(b'\0')[0].decode('ascii'));ptr=struct.unpack_from('<H',scenario,at)[0]
    assert names==['Liu Bei','Guan Yu','Zhang Fei']
    result=dict(method='Static unpacking, disassembly and exact byte checks; no DOS runtime execution',originalSha256=sha,unpackedSha256=hashlib.sha256(image).hexdigest(),unpackedBytes=len(image),compressionBlocks=blocks,offsets='Unpacked load-image offsets; not packed-file offsets or relocated DOS addresses',checks={name:hex(offset) for name,(offset,_) in checks.items()},messengers='Rival Tigers requires at least two ready officers; separate calls to the same candidate selector store two officers and dispatch two journeys, one per rival. Other inspected spy/diplomatic entry points use one selector. Exact probabilities remain remaster approximations.',charge='Defender defeat takes the target tile; surviving-defender breakthrough is separate and tests attacker War.',daughters='One availability flag plus outgoing (+0x21) and incoming (+0x20) marriage links; no numerical child age/count records or birth-event mechanism identified. Expanded spouses, births and ages are separate remaster rules.',liuBei189=names)
    args.output.parent.mkdir(parents=True,exist_ok=True);args.output.write_text(json.dumps(result,indent=2)+'\n')
    print(f'{len(checks)} binary checks passed; Liu Bei 189: {len(names)} officers. {args.output}')
if __name__=='__main__':main()
