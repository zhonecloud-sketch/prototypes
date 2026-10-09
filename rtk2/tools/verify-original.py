"""Static v32 checks on supplied packed English main.exe and scenario.dat.
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
      'clan_announcement_retirement':(0x8052,'c70700008b1ecc40c64722ffa1d840051c0050b8a140509ae806ef03'),
      'execution_hostility100':(0x9b6f,'ff76089a0600250583c4022ae48bf08b5ef8c6400e64'),
      'successor_blood_and_loyalty':(0x7aaf,'8b4410854710741a8a4709a2e13fa0e03f3806e13f760b'),
      'initial_invasion_five':(0x128a0,'b005cb'),
      'invasion_capacity_passed_to_picker':(0x156e2,'9a480351128846fc0ac07503e920ffa19acaa336358a46fc500ee8f5fb'),
      'ongoing_war_capacity_ten_or_five':(0x1f06e,'c70680c90000c746fe72cbc646fa0aeb0a90c746fe86cbc646fa05'),
      'reinforcement_capacity_ten':(0x2cad3,'c746f872cb2bc050ff3676cb9aca09c52383c4048846f23c0a7203e988018b5ef8ff77029ac601332383c4020bc07503e97301b00a2a46f28846f6'),
      'wind_no_wind_or_direction':(0x240a9,'837e0606750fb86fb4509ac006ef038be58be55dcbb878b4509ac006ef038be5'),
      'wind_direction_table':(0x240cd,'8b5e06d1e3ffb79eb4'),
      'daily_rations_divide_by_30_minimum_one':(0x22e7b,'b8010050b81e00995250ff7608ff76069a18380000509a9c01610583c404'),
      'ration_linked_list_sums_soldiers':(0x245f7,'8bd88b47122bd20146fc1156fe'),
      'defender_reserve_rations_added':(0x22f4c,'807efa0075182bc0508b1e74cbff77029a8c09c52383c4040146fc1156fe'),
      'invasion_monthly_food_estimate':(0x1540c,'b8010050a192ceb91e002bd2f7f1509a9c01610583c404b91e00f7e18946fe'),
      'ai_food_five_times_men_divisor_then_jitter':(0x1e18c,'a192ce2bd28bd88bf2d1e0d1d2d1e0d1d203c313d652508bf19a1838000003c683d200a3aece8916b0ce'),
      'abstract_rations_divide_by_six_plus_five':(0x20a81,'b80600995250ff76faff76f89a1838000005050083d200'),
      'abstract_combat_six_exchanges':(0x213bb,'fe46f4807ef4067303e9b1fe'),
      'abstract_combat_entry':(0x21418,'0ee898fb0bc074040ee814fd'),
      'food_exhaustion_check':(0x22dbc,'0bd27f2b7c0783bca5ca017322'),
      'food_exhaustion_both_armies_outcome':(0x22dd0,'807e0601f51ac0240450807e06011ac0f6d8509a9806aa24'),
      'invasion_food_uses_province_stock':(0x15449,'8b1e9a33ff770cff770a2bc050509ae208ef03'),
      'province_food_stock_cap_3000000':(0x8fab,'837f0c2d7c167f07817f0ac0c6760d'),
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
    checks.update({
      'reward_horse_uses_100_value':(0x1071e,'837e08007505c746086400'),
      'reward_random_bonus_bound_two':(0x10729,'b002509afa007c05'),
      'reward_governor_charm_divided_by_400':(0x10731,'8b1e9a338b5f028bc88a47062ae4f76608bb90012bd2f7f302c1'),
      'reward_horse_marks_governor_action':(0x18b9e,'8b1e9a33ff77029a00079d0583c402'),
      'reward_horse_deducts_one_stock':(0x18bad,'8b1e9a33fe4f19'),
      'reward_gold_deducts_selected_amount':(0x18c67,'8b46fc8b1e9a33294708'),
      'writing_advisor_int_greater_than_pupil_plus_one':(0x18a56,'8b1e94338b5f048a47042ae48b5efe8a4f042aed413bc17e05'),
      'writing_increments_pupil_int':(0x18aad,'8b5efefe4704'),
      'hire_capacity_population_and_rations':(0x10f63,'817f0ef401766e39470e76698b470e8bc80346fcd1e82b46fc'),
      'hire_capacity_gold_divided_by_ten':(0x10fa3,'8b1e9a338b4708b90a002bd2f7f1'),
      'hire_capacity_ceil_army_space_hundreds':(0x10f2c,'b864009952508b46fa8b56fc05630083d20052509a18380000'),
      'hire_deducts_ten_gold_per_hundred':(0x110d8,'8b46068bc8d1e0d1e003c1d1e08b1e9a33294708'),
      'hire_deducts_hundred_food_and_population':(0x110ec,'b89cff9952508b46062bd252509ab23800008b1e9a3301470a11570c8b46068b1e9a3329470e'),
    })
    checks.update({
      'native_wait_caps_at_six':(0x2262a,'8b1ee6b8807f17067303fe4717'),
      'mobility_training_floor_and_preserve':(0x24a84,'8a46feb1142ae4f6f104022ae4508a4717509a9c016105'),
      'terrain_costs_plain_forest_hill_mountain_water_fort_palace':(0x3b12c,'02030300050303'),
      'fire_damage_random_percentage_bound':(0x24774,'837e08011ac0241904052ae450ff77129a32009c0483c404509a78019c04'),
      'burning_unit_uses_fire_loss_mode_zero':(0x22e58,'2bc050ff76069a02007524'),
      'random_bound_is_exclusive':(0x4b48,'0ee8b2ff2bd2f776068bc2')})
    checks.update({
      'enemy_recruit_shared_blood_gate':(0x12ee4,'8b441085471075228bde'),
      'enemy_recruit_loyalty_100_gate':(0x12eee,'807f0b64741a'),
      'enemy_recruit_protected_zero':(0x12f0e,'c646fe00'),
      'recruit_gate_linked_list_call':(0x10e16,'9a08068a12'),
      'recruit_gate_battle_command_call':(0x16682,'9a08068a12'),
      'recruit_gate_covert_allegiance_branch':(0x12eb2,'f6470202741cff36'),
    })
    checks.update({
      'disaster_percent_floor':(0x49da,'8b460a2bd252508b4608f7660652509a18380000'),
      'disaster_dispatch_four_branches':(0xee31,'8a46062ae40bc07418487503e9be00487503e91a01487503e9f201'),
      'locust_loyalty_retained_70_to_90':(0xee52,'b81500509a78019c0483c402054600508b5e'),
      'locust_land_retained_50_to_70':(0xee79,'b81500509a78019c0483c402053200508b5e'),
      'locust_food_half_plus_random_percent':(0xeea0,'b80200995250ff770cff770a9a18380000'),
      'epidemic_population_retained_75_to_90_plus_one':(0xef25,'b81000509a78019c0483c402054b00508b5efeff770e9a32009c0483c404408b5efe89470eb0'),
      'epidemic_troops_base_80_and_sickness':(0xef4a,'b00a50b8010050530ee83efe83c406'),
      'disaster_troops_base_plus_zero_to_five':(0xedb6,'b80600509a78019c0483c4028a4e0a2aed03c1054600508b5efeff77129a32009c04'),
      'epidemic_sickness_zero_to_three':(0xedf2,'8b5efe8067030fb004509afa007c0583c4028b5efe084703'),
      'flood_troop_control_quarter':(0xef60,'8b5efe8a4718d0e8d0e8502bc050530ee821fe83c406'),
      'flood_population_control_fifth':(0xef76,'b80600509a78019c0483c4028b5efe8bc88a4718b3052ae4f6f32ae403c883c14b518b5efeff770e9a32009c0483c40440'),
      'flood_control_retained_75_to_90':(0xf014,'b81000509a78019c0483c402054b00508b5efe8a47182ae4509a3200'),
      'typhoon_loyalty_retained_90_to_99':(0xf03e,'b80a00509a78019c0483c402055a00508b5e'),
      'typhoon_control_retained_60_to_80':(0xf09c,'b81500509a78019c0483c402053c00508b5efe8a47182ae4509a32009c04'),
      'locust_flood_exchange_rate_floor':(0xe1dc,'558becb85000508b5e068a471b2ae4509a32009c048be550b005509afa007c0583c4022ae4050a00509a9c0161058b5e0688471b8be55dcb'),
    })
    checks.update({
      'uprising_loyalty_retained_10_to_30':(0xeaca,'b81500509a78019c0483c402050a00508b'),
      'uprising_gold_retained_50_to_70':(0xeb18,'b81500509a78019c0483c402053200508b5e06ff77089a32009c04'),
      'uprising_troops_retained_60_to_80':(0xeb94,'b81500509a78019c0483c402053c00508b5efeff77129a32009c0483c404'),
      'uprising_population_refugee_transfer':(0xebcf,'8b5e068b470e8946fcb91500518bf09a78019c0483c402053c0050569a32009c0483c404408b5e0689470eb83075508b46fc2b470e50539a28049d0583c402509afa007c0583c4028ad82affd1e38b8762ca050e00509a8c009c0483c4068b5e06804f1330'),
      'disaster_skip_field_army_province':(0xed9a,'ff76069a9200420583c4020bc0756d'),
      'native_percentage_floor_helper':(0x49ca,'558bec837e0a007507b8ffff8be55dcb8b460a2bd252508b4608f7660652509a183800008be55dcb'),
    })
    checks.update({'development_actor_int_plus_half_charm': (67414, '8b5e068a4706d0e80247048846fe'), 'development_diminishing_and_percent': (67428, '8a460ad0e82ae42d6400f7d850ff76089a32009c04'), 'development_final_subtract_full_difficulty': (67502, '8846fea0b333508d46fe509a6c009c04'), 'flood_native_field_and_shared_formula': (67529, '8b1e9a33807f18647207'), 'cultivate_native_field_and_shared_formula': (67567, '8b1e9a33807f16647207'), 'melee_power_training_war_equipment': (145171, '8b5e068a47162ae48946fa539aee00250583c4022ae48946fc8b5e068a47058946fe817f1aa30075048346fe14'), 'combat_divisor_table': (241110, '0a000a000c000a0008000f0014000500'), 'palace_assault_divisor_index_seven': (145296, '0bc07404c6460a07'), 'melee_random_bound300': (145304, 'b82c01509a78019c04'), 'casualty_no_power_advantage_fallback1to30': (145362, '0bc07c0fb81e00509a78019c0483c402f7d848'), 'charge_count_one_through_ten': (156569, 'b00a509afa007c0583c4022ae4408946fa'), 'deployment_zone_resource_offset': (159966, '81c6fc1813c85156ff369ecb9acc020000'), 'local_reinforce_only_defending_side': (183548, 'ff36e6b89a0405332383c402fec875080ee8bcfd')})
    for name,(offset,hexbytes) in checks.items():
        expected=bytes.fromhex(hexbytes);assert image[offset:offset+len(expected)]==expected,name
    scenario=(args.inputs/'scenario.dat').read_bytes();ptr=struct.unpack_from('<H',scenario,0x2dc4-0x42+3*35+2)[0];names=[]
    while ptr:
        at=ptr-0x42;names.append(scenario[at+28:at+41].split(b'\0')[0].decode('ascii'));ptr=struct.unpack_from('<H',scenario,at)[0]
    assert names==['Liu Bei','Guan Yu','Zhang Fei']
    result=dict(disasters='Verified four-way native dispatcher: 0 locust, 1 epidemic, 2 flood, 3 typhoon. The percentage helper floors value times retained percentage / 100; random upper bounds are exclusive. Native population uses 100-person units and adds one unit after retention. Typhoon does not directly modify population, soldiers, stored gold or food; flood leaves stored gold and food unchanged; locust leaves stored gold/population/soldiers unchanged. Epidemic troop helper writes a random sickness period 0..3. Locust/flood also lower food exchange rate to max(floor(old*80/100), random integer 10..14). Timing/spread, persistent famine penalty, governor rebellion and miscellaneous event mechanics remain remaster approximations. Popular uprising losses and adjacent refugee transfer use the recovered branch at 0xeac2.',recruitmentProtection='Hostile recruitment tests shared officer blood-mask word (+0x10) with their serving ruler, then loyalty byte (+0x0b) against 100. Either branches to a zero result. A covert-allegiance special branch precedes these tests. Calls appear in linked-list and battle-command paths. No separate named-character never-recruit flag has been established. Full capture/recruit coefficients remain approximations.',method='Static unpacking, disassembly and exact byte checks; no DOS runtime execution',originalSha256=sha,unpackedSha256=hashlib.sha256(image).hexdigest(),unpackedBytes=len(image),compressionBlocks=blocks,offsets='Unpacked load-image offsets; not packed-file offsets or relocated DOS addresses',checks={name:hex(offset) for name,(offset,_) in checks.items()},rations='Daily food is max(1, integer(total soldiers / 30)); defending non-field reserves are added. Monthly estimate multiplies daily food by 30. Native AI forms carried food from five times selected soldiers divided by two or four plus random up to half the men; the choice condition remains untraced. Abstract combat has a separate six-exchange routine and food helper dividing total men by six plus five. Exact abstract combat coefficients are not fully ported.',food='DOS food exhaustion tests the army rice store against one and writes the winning side and food outcome codes immediately; it does not wait for morale. Invasion input uses full province stock as its upper bound. Province stores clamp at 0x002dc6c0 = 3,000,000. Static disassembly, not DOS execution.',messengers='Rival Tigers requires at least two ready officers; separate calls to the same candidate selector store two officers and dispatch two journeys, one per rival. Other inspected spy/diplomatic entry points use one selector. Exact probabilities remain remaster approximations.',charge='Defender defeat takes the target tile; surviving-defender breakthrough is separate and tests attacker War.',daughters='One availability flag plus outgoing (+0x21) and incoming (+0x20) marriage links; no numerical child age/count records or birth-event mechanism identified. Expanded spouses, births and ages are separate remaster rules.',battleMobility='Terrain cost table: 2,3,3,impassable,5,3,3. Unit activation restores max(current mobility, 2 + floor(max(0, training - 1) / 20)); Wait adds one only below six.',fireDamage='Fire mode zero chooses a 30 percent random bound. The RNG returns an integer strictly below floor(soldiers * 30 / 100); a burning unit below 100 soldiers is defeated. No mandatory 30 percent or 100-soldier daily loss.',liuBei189=names)
    args.output.parent.mkdir(parents=True,exist_ok=True);args.output.write_text(json.dumps(result,indent=2)+'\n')
    print(f'{len(checks)} binary checks passed; Liu Bei 189: {len(names)} officers. {args.output}')
if __name__=='__main__':main()
