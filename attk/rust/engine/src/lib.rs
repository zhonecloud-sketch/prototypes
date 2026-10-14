//! Arithmetic port of the v56 native-combat module.
//! RNG remains in the caller to preserve each original draw and its order.
//! f64 deliberately matches JavaScript Number operations and truncation.

const DIVISORS: [f64; 8] = [10.0, 10.0, 12.0, 10.0, 8.0, 15.0, 20.0, 5.0];

#[no_mangle]
pub extern "C" fn kernel_version() -> u32 {
    1
}

#[no_mangle]
pub extern "C" fn equipment_percent(soldiers: f64, weapons: f64) -> f64 {
    if soldiers == 0.0 {
        100.0
    } else {
        (100.0 * weapons / soldiers).floor().min(100.0)
    }
}

#[no_mangle]
pub extern "C" fn combat_power(
    war: f64,
    bonus: f64,
    training: f64,
    soldiers: f64,
    weapons: f64,
) -> f64 {
    3.0 * (war + bonus) + training + equipment_percent(soldiers, weapons)
}

#[no_mangle]
pub extern "C" fn casualty_raw(
    own: f64,
    other: f64,
    men: f64,
    terrain: u32,
    factor: f64,
    random300: f64,
) -> f64 {
    let divisor = DIVISORS.get(terrain as usize).copied().unwrap_or(f64::NAN);
    ((10.0 * (own - other - men.min(random300)) / divisor).trunc() / factor).trunc()
}

#[no_mangle]
pub extern "C" fn flee_chance(
    horse: u32,
    war: f64,
    training: f64,
    men: f64,
    mobility: f64,
    enemies: f64,
    special: u32,
    ruler: u32,
    random10: f64,
) -> f64 {
    if horse != 0 {
        return 100.0;
    }
    let base = ((war + training + (men / 100.0).floor() + 10.0 * mobility)
        / (enemies + 2.0))
        .floor();
    (base
        + if special != 0 { 20.0 } else { 0.0 }
        + if ruler != 0 { 20.0 } else { 0.0 }
        + random10)
        .min(100.0)
}

#[no_mangle]
pub extern "C" fn training_gain(war: f64, untrained_hundreds: f64) -> f64 {
    (2.0 * war / (1.0 + untrained_hundreds).sqrt().floor()).floor()
}

#[no_mangle]
pub extern "C" fn food_gain(
    population: f64,
    governor: f64,
    officer: f64,
    food: f64,
    difficulty: f64,
) -> f64 {
    let divisor = (6.0 + difficulty) * (population / 100.0).floor().sqrt().floor();
    if divisor == 0.0 {
        return 255.0;
    }
    let value = (((governor + officer) / 2.0).floor() * food.sqrt().floor()
        / divisor)
        .floor();
    // JavaScript '& 255' on the nonnegative finite gameplay domain.
    ((value as u64) & 255) as f64
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn equipment_caps_and_empty_army() {
        assert_eq!(equipment_percent(0.0, 0.0), 100.0);
        assert_eq!(equipment_percent(3.0, 2.0), 66.0);
        assert_eq!(equipment_percent(100.0, 500.0), 100.0);
    }

    #[test]
    fn native_nested_truncation_preserves_negative_branch() {
        assert_eq!(casualty_raw(101.0, 200.0, 500.0, 2, 2.0, 299.0), -165.0);
        assert_eq!(casualty_raw(300.0, 100.0, 0.0, 1, 1.0, 299.0), 200.0);
        assert_eq!(casualty_raw(100.0, 101.0, 0.0, 6, 2.0, 0.0), 0.0);
    }

    #[test]
    fn special_flee_and_governance_boundaries() {
        assert_eq!(flee_chance(1, 0.0, 0.0, 0.0, 0.0, 99.0, 0, 0, 0.0), 100.0);
        assert_eq!(training_gain(90.0, 3.0), 90.0);
        assert_eq!(food_gain(99.0, 90.0, 90.0, 100.0, 0.0), 255.0);
    }
}
