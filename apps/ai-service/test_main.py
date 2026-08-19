import unittest
from unittest.mock import patch
import io
import sys

# Import the main function
from main import main, query_gemini_tutor, query_openai_tutor

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
        self.assertIn("Google Gemini integration path ready.", output)
        self.assertIn("OpenAI GPT integration path ready.", output)
        self.assertIn("Langflow integration path established.", output)

    def test_gemini_tutor_helper(self):
        res = query_gemini_tutor("What is gravity?", "STEM & Sciences", "Beginner")
        self.assertIn("[Google Gemini 1.5 Flash]", res)
        self.assertIn("What is gravity?", res)

    def test_openai_tutor_helper(self):
        res = query_openai_tutor("What is gravity?", "STEM & Sciences", "Beginner")
        self.assertIn("[OpenAI GPT-4o]", res)
        self.assertIn("What is gravity?", res)

if __name__ == "__main__":
    unittest.main()
