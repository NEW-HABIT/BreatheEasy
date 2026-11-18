import unittest
import sys
import os

# Add backend directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from database import hash_password, verify_password
from services.aqi_service import degrees_to_compass, assess_inversion_risk
from services.impact_service import calculate_impact, SWAPS


class TestDatabaseSecurity(unittest.TestCase):
    def test_password_hashing_and_verification(self):
        password = "secretPassword123!"
        hashed = hash_password(password)
        self.assertNotEqual(password, hashed)
        self.assertTrue(verify_password(password, hashed))
        self.assertFalse(verify_password("wrongPassword", hashed))


class TestAqiService(unittest.TestCase):
    def test_degrees_to_compass(self):
        self.assertEqual(degrees_to_compass(0), "N")
        self.assertEqual(degrees_to_compass(90), "E")
        self.assertEqual(degrees_to_compass(180), "S")
        self.assertEqual(degrees_to_compass(270), "W")
        self.assertEqual(degrees_to_compass(None), "Calm")

    def test_inversion_risk_assessment(self):
        # Cold (8C), Calm wind (2 km/h), high humidity (80%), high pressure (1020 hPa)
        risk_level, explanation = assess_inversion_risk(2.0, 80.0, 1020.0)
        self.assertEqual(risk_level, "Severe")
        self.assertIn("Near-zero ground wind", explanation)

        # Warm (30C), strong breeze (20 km/h), normal pressure (1005 hPa)
        risk_level_low, _ = assess_inversion_risk(20.0, 50.0, 1005.0)
        self.assertEqual(risk_level_low, "Low")


class TestImpactService(unittest.TestCase):
    def test_calculate_impact_all_swaps(self):
        all_ids = [s["id"] for s in SWAPS]
        impact = calculate_impact(all_ids)
        self.assertGreater(impact["dailyCo2SavedKg"], 0)
        self.assertGreater(impact["monthlyCo2SavedKg"], 0)
        self.assertGreater(impact["treesEquivalent"], 0)
        self.assertGreater(impact["avgPm25ReductionPercent"], 0)

    def test_calculate_impact_empty(self):
        impact = calculate_impact([])
        self.assertEqual(impact["dailyCo2SavedKg"], 0)
        self.assertEqual(impact["monthlyCo2SavedKg"], 0)
        self.assertEqual(impact["treesEquivalent"], 0)
        self.assertEqual(impact["avgPm25ReductionPercent"], 0)


if __name__ == "__main__":
    unittest.main()
