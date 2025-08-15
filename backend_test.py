#!/usr/bin/env python3
"""
VeloX Bike Agency Backend API Test Suite
Tests all backend API endpoints for functionality, error handling, and data persistence.
"""

import requests
import json
import uuid
import time
from datetime import datetime

# Configuration
BASE_URL = "https://next-3d-showcase.preview.emergentagent.com/api"
HEADERS = {"Content-Type": "application/json"}

class VeloXAPITester:
    def __init__(self):
        self.test_results = []
        self.failed_tests = []
        self.passed_tests = []
        
    def log_test(self, test_name, status, message, response_data=None):
        """Log test results"""
        result = {
            "test": test_name,
            "status": status,
            "message": message,
            "timestamp": datetime.now().isoformat(),
            "response_data": response_data
        }
        self.test_results.append(result)
        
        if status == "PASS":
            self.passed_tests.append(test_name)
            print(f"✅ {test_name}: {message}")
        else:
            self.failed_tests.append(test_name)
            print(f"❌ {test_name}: {message}")
            if response_data:
                print(f"   Response: {response_data}")
    
    def test_api_root(self):
        """Test GET /api - API info endpoint"""
        try:
            response = requests.get(f"{BASE_URL}", headers=HEADERS, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if "message" in data and "endpoints" in data:
                    self.log_test("API Root Endpoint", "PASS", 
                                f"API info returned successfully with {len(data['endpoints'])} endpoints")
                    return data
                else:
                    self.log_test("API Root Endpoint", "FAIL", 
                                "Response missing required fields", data)
            else:
                self.log_test("API Root Endpoint", "FAIL", 
                            f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("API Root Endpoint", "FAIL", f"Request failed: {str(e)}")
        return None
    
    def test_bikes_endpoint(self):
        """Test GET /api/bikes - Get all bikes"""
        try:
            response = requests.get(f"{BASE_URL}/bikes", headers=HEADERS, timeout=10)
            
            if response.status_code == 200:
                bikes = response.json()
                if isinstance(bikes, list) and len(bikes) == 4:
                    # Verify bike structure
                    required_fields = ["id", "name", "type", "price", "features", "specifications"]
                    all_valid = True
                    
                    for bike in bikes:
                        for field in required_fields:
                            if field not in bike:
                                all_valid = False
                                break
                    
                    if all_valid:
                        self.log_test("Get All Bikes", "PASS", 
                                    f"Retrieved {len(bikes)} bikes with complete specifications")
                        return bikes
                    else:
                        self.log_test("Get All Bikes", "FAIL", 
                                    "Bikes missing required fields", bikes[0] if bikes else None)
                else:
                    self.log_test("Get All Bikes", "FAIL", 
                                f"Expected 4 bikes, got {len(bikes) if isinstance(bikes, list) else 'invalid format'}")
            else:
                self.log_test("Get All Bikes", "FAIL", 
                            f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("Get All Bikes", "FAIL", f"Request failed: {str(e)}")
        return None
    
    def test_bike_by_id(self):
        """Test GET /api/bikes/:id - Get specific bike"""
        # Test valid bike ID
        try:
            response = requests.get(f"{BASE_URL}/bikes/1", headers=HEADERS, timeout=10)
            
            if response.status_code == 200:
                bike = response.json()
                if "id" in bike and bike["id"] == 1:
                    self.log_test("Get Bike by Valid ID", "PASS", 
                                f"Retrieved bike: {bike.get('name', 'Unknown')}")
                else:
                    self.log_test("Get Bike by Valid ID", "FAIL", 
                                "Invalid bike data returned", bike)
            else:
                self.log_test("Get Bike by Valid ID", "FAIL", 
                            f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("Get Bike by Valid ID", "FAIL", f"Request failed: {str(e)}")
        
        # Test invalid bike ID
        try:
            response = requests.get(f"{BASE_URL}/bikes/999", headers=HEADERS, timeout=10)
            
            if response.status_code == 404:
                error_data = response.json()
                if "error" in error_data:
                    self.log_test("Get Bike by Invalid ID", "PASS", 
                                "Correctly returned 404 for invalid bike ID")
                else:
                    self.log_test("Get Bike by Invalid ID", "FAIL", 
                                "404 response missing error message", error_data)
            else:
                self.log_test("Get Bike by Invalid ID", "FAIL", 
                            f"Expected 404, got HTTP {response.status_code}")
        except Exception as e:
            self.log_test("Get Bike by Invalid ID", "FAIL", f"Request failed: {str(e)}")
    
    def test_contact_form_valid(self):
        """Test POST /api/contact with valid data"""
        test_contact = {
            "name": "John Smith",
            "email": "john.smith@example.com",
            "message": "I'm interested in the VeloX Pro bike. Can you provide more details about financing options?"
        }
        
        try:
            response = requests.post(f"{BASE_URL}/contact", 
                                   headers=HEADERS, 
                                   json=test_contact, 
                                   timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if data.get("success") and "id" in data:
                    self.log_test("Contact Form Valid Data", "PASS", 
                                f"Contact submitted successfully with ID: {data['id']}")
                    return data["id"]
                else:
                    self.log_test("Contact Form Valid Data", "FAIL", 
                                "Response missing success confirmation", data)
            else:
                self.log_test("Contact Form Valid Data", "FAIL", 
                            f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("Contact Form Valid Data", "FAIL", f"Request failed: {str(e)}")
        return None
    
    def test_contact_form_invalid(self):
        """Test POST /api/contact with missing required fields"""
        # Test missing name
        invalid_contact = {
            "email": "test@example.com",
            "message": "Test message"
        }
        
        try:
            response = requests.post(f"{BASE_URL}/contact", 
                                   headers=HEADERS, 
                                   json=invalid_contact, 
                                   timeout=10)
            
            if response.status_code == 400:
                error_data = response.json()
                if "error" in error_data:
                    self.log_test("Contact Form Missing Name", "PASS", 
                                "Correctly rejected contact with missing name")
                else:
                    self.log_test("Contact Form Missing Name", "FAIL", 
                                "400 response missing error message", error_data)
            else:
                self.log_test("Contact Form Missing Name", "FAIL", 
                            f"Expected 400, got HTTP {response.status_code}")
        except Exception as e:
            self.log_test("Contact Form Missing Name", "FAIL", f"Request failed: {str(e)}")
        
        # Test missing email
        invalid_contact = {
            "name": "Test User",
            "message": "Test message"
        }
        
        try:
            response = requests.post(f"{BASE_URL}/contact", 
                                   headers=HEADERS, 
                                   json=invalid_contact, 
                                   timeout=10)
            
            if response.status_code == 400:
                self.log_test("Contact Form Missing Email", "PASS", 
                            "Correctly rejected contact with missing email")
            else:
                self.log_test("Contact Form Missing Email", "FAIL", 
                            f"Expected 400, got HTTP {response.status_code}")
        except Exception as e:
            self.log_test("Contact Form Missing Email", "FAIL", f"Request failed: {str(e)}")
    
    def test_get_contacts(self):
        """Test GET /api/contact - Retrieve submitted contacts"""
        try:
            response = requests.get(f"{BASE_URL}/contact", headers=HEADERS, timeout=10)
            
            if response.status_code == 200:
                contacts = response.json()
                if isinstance(contacts, list):
                    self.log_test("Get Contacts", "PASS", 
                                f"Retrieved {len(contacts)} contact messages")
                    
                    # Verify contact structure if any exist
                    if contacts:
                        contact = contacts[0]
                        required_fields = ["id", "name", "email", "message", "timestamp"]
                        missing_fields = [field for field in required_fields if field not in contact]
                        
                        if not missing_fields:
                            self.log_test("Contact Data Structure", "PASS", 
                                        "Contact data has all required fields")
                        else:
                            self.log_test("Contact Data Structure", "FAIL", 
                                        f"Missing fields: {missing_fields}", contact)
                    
                    return contacts
                else:
                    self.log_test("Get Contacts", "FAIL", 
                                "Response is not a list", contacts)
            else:
                self.log_test("Get Contacts", "FAIL", 
                            f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("Get Contacts", "FAIL", f"Request failed: {str(e)}")
        return None
    
    def test_newsletter_valid(self):
        """Test POST /api/newsletter with valid email"""
        test_email = {
            "email": f"newsletter.test.{int(time.time())}@example.com"
        }
        
        try:
            response = requests.post(f"{BASE_URL}/newsletter", 
                                   headers=HEADERS, 
                                   json=test_email, 
                                   timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if data.get("success") and "id" in data:
                    self.log_test("Newsletter Valid Email", "PASS", 
                                f"Newsletter subscription successful with ID: {data['id']}")
                    return data["id"]
                else:
                    self.log_test("Newsletter Valid Email", "FAIL", 
                                "Response missing success confirmation", data)
            else:
                self.log_test("Newsletter Valid Email", "FAIL", 
                            f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("Newsletter Valid Email", "FAIL", f"Request failed: {str(e)}")
        return None
    
    def test_newsletter_invalid(self):
        """Test POST /api/newsletter with missing email"""
        invalid_data = {}
        
        try:
            response = requests.post(f"{BASE_URL}/newsletter", 
                                   headers=HEADERS, 
                                   json=invalid_data, 
                                   timeout=10)
            
            if response.status_code == 400:
                error_data = response.json()
                if "error" in error_data:
                    self.log_test("Newsletter Missing Email", "PASS", 
                                "Correctly rejected newsletter signup with missing email")
                else:
                    self.log_test("Newsletter Missing Email", "FAIL", 
                                "400 response missing error message", error_data)
            else:
                self.log_test("Newsletter Missing Email", "FAIL", 
                            f"Expected 400, got HTTP {response.status_code}")
        except Exception as e:
            self.log_test("Newsletter Missing Email", "FAIL", f"Request failed: {str(e)}")
    
    def test_booking_valid(self):
        """Test POST /api/booking with complete booking data"""
        test_booking = {
            "bikeId": 1,
            "customerName": "Sarah Johnson",
            "customerEmail": f"booking.test.{int(time.time())}@example.com",
            "customerPhone": "+1-555-123-4567",
            "message": "I would like to schedule a test ride for the VeloX Pro. I'm available weekdays after 5 PM."
        }
        
        try:
            response = requests.post(f"{BASE_URL}/booking", 
                                   headers=HEADERS, 
                                   json=test_booking, 
                                   timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if data.get("success") and "bookingId" in data:
                    self.log_test("Booking Valid Data", "PASS", 
                                f"Booking submitted successfully with ID: {data['bookingId']}")
                    return data["bookingId"]
                else:
                    self.log_test("Booking Valid Data", "FAIL", 
                                "Response missing success confirmation", data)
            else:
                self.log_test("Booking Valid Data", "FAIL", 
                            f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("Booking Valid Data", "FAIL", f"Request failed: {str(e)}")
        return None
    
    def test_booking_invalid(self):
        """Test POST /api/booking with missing required fields"""
        # Test missing bikeId
        invalid_booking = {
            "customerName": "Test User",
            "customerEmail": "test@example.com"
        }
        
        try:
            response = requests.post(f"{BASE_URL}/booking", 
                                   headers=HEADERS, 
                                   json=invalid_booking, 
                                   timeout=10)
            
            if response.status_code == 400:
                error_data = response.json()
                if "error" in error_data:
                    self.log_test("Booking Missing BikeId", "PASS", 
                                "Correctly rejected booking with missing bikeId")
                else:
                    self.log_test("Booking Missing BikeId", "FAIL", 
                                "400 response missing error message", error_data)
            else:
                self.log_test("Booking Missing BikeId", "FAIL", 
                            f"Expected 400, got HTTP {response.status_code}")
        except Exception as e:
            self.log_test("Booking Missing BikeId", "FAIL", f"Request failed: {str(e)}")
    
    def test_invalid_routes(self):
        """Test invalid routes return 404"""
        invalid_routes = ["/invalid", "/bikes/invalid", "/nonexistent"]
        
        for route in invalid_routes:
            try:
                response = requests.get(f"{BASE_URL}{route}", headers=HEADERS, timeout=10)
                
                if response.status_code == 404:
                    self.log_test(f"Invalid Route {route}", "PASS", 
                                "Correctly returned 404 for invalid route")
                else:
                    self.log_test(f"Invalid Route {route}", "FAIL", 
                                f"Expected 404, got HTTP {response.status_code}")
            except Exception as e:
                self.log_test(f"Invalid Route {route}", "FAIL", f"Request failed: {str(e)}")
    
    def test_cors_headers(self):
        """Test CORS headers are properly set"""
        try:
            response = requests.get(f"{BASE_URL}/", headers=HEADERS, timeout=10)
            
            cors_headers = [
                "Access-Control-Allow-Origin",
                "Access-Control-Allow-Methods",
                "Access-Control-Allow-Headers"
            ]
            
            missing_headers = []
            for header in cors_headers:
                if header not in response.headers:
                    missing_headers.append(header)
            
            if not missing_headers:
                self.log_test("CORS Headers", "PASS", 
                            "All required CORS headers are present")
            else:
                self.log_test("CORS Headers", "FAIL", 
                            f"Missing CORS headers: {missing_headers}")
        except Exception as e:
            self.log_test("CORS Headers", "FAIL", f"Request failed: {str(e)}")
    
    def run_all_tests(self):
        """Run all API tests"""
        print("🚀 Starting VeloX Bike Agency API Tests")
        print("=" * 60)
        
        # Basic API tests
        self.test_api_root()
        self.test_bikes_endpoint()
        self.test_bike_by_id()
        
        # Contact form tests
        self.test_contact_form_valid()
        self.test_contact_form_invalid()
        self.test_get_contacts()
        
        # Newsletter tests
        self.test_newsletter_valid()
        self.test_newsletter_invalid()
        
        # Booking tests
        self.test_booking_valid()
        self.test_booking_invalid()
        
        # Error handling tests
        self.test_invalid_routes()
        self.test_cors_headers()
        
        # Print summary
        print("\n" + "=" * 60)
        print("📊 TEST SUMMARY")
        print("=" * 60)
        print(f"✅ Passed: {len(self.passed_tests)}")
        print(f"❌ Failed: {len(self.failed_tests)}")
        print(f"📈 Success Rate: {len(self.passed_tests)/(len(self.passed_tests)+len(self.failed_tests))*100:.1f}%")
        
        if self.failed_tests:
            print("\n❌ Failed Tests:")
            for test in self.failed_tests:
                print(f"   - {test}")
        
        print("\n✅ Passed Tests:")
        for test in self.passed_tests:
            print(f"   - {test}")
        
        return len(self.failed_tests) == 0

if __name__ == "__main__":
    tester = VeloXAPITester()
    success = tester.run_all_tests()
    
    if success:
        print("\n🎉 All tests passed! VeloX API is working correctly.")
        exit(0)
    else:
        print(f"\n⚠️  {len(tester.failed_tests)} test(s) failed. Please check the issues above.")
        exit(1)