import unittest
from unittest.mock import patch
import io
import sys

# Import the main function
from main import main

class TestAIService(unittest.TestCase):
    @patch('sys.stdout', new_callable=io.StringIO)
    def test_main_execution(self, mock_stdout):
        # Execute the main function
        main()

        # Get stdout output
        output = mock_stdout.getvalue()

        # Verify core expectations of main function
        self.assertIn("Mawaba AI Service Initialized", output)
        self.assertIn("Checking integrations...", output)
        self.assertIn("Prompt Template:", output)
        self.assertIn("Google API client structure ready.", output)
        self.assertIn("Langflow integration path established.", output)

if __name__ == "__main__":
    unittest.main()
