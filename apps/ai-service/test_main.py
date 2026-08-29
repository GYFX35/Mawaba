import unittest
from unittest.mock import patch, MagicMock
import io
import sys
import json
import os

from main import main, query_gemini_tutor, query_gemini_tutor_structured, query_openai_tutor


class TestAIService(unittest.TestCase):
    @patch('sys.stdout', new_callable=io.StringIO)
    def test_main_execution(self, mock_stdout):
        main([])
        output = mock_stdout.getvalue()
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

    def test_gemini_tutor_structured(self):
        res = query_gemini_tutor_structured("What is quantum mechanics?", "STEM & Sciences", "Intermediate", "Explanation")
        self.assertEqual(res["question"], "What is quantum mechanics?")
        self.assertEqual(res["discipline"], "STEM & Sciences")
        self.assertIn("quantum", res["answer"].lower())
        self.assertIn("Gemini", res["model"])
        self.assertIsInstance(res["keyTakeaways"], list)
        self.assertIsInstance(res["followUpQuestions"], list)

    @patch('sys.stdout', new_callable=io.StringIO)
    def test_cli_json_mode(self, mock_stdout):
        payload = json.dumps({
            "question": "Explain thermodynamics",
            "discipline": "STEM & Sciences",
            "level": "Advanced",
            "responseType": "Explanation"
        })
        main(['--json', payload])
        output = mock_stdout.getvalue().strip()
        data = json.loads(output)
        self.assertEqual(data["question"], "Explain thermodynamics")
        self.assertEqual(data["level"], "Advanced")
        self.assertIn("Gemini", data["model"])

    @patch.dict(os.environ, {"GEMINI_API_KEY": "fake_test_key"})
    @patch("google.genai.Client")
    def test_google_genai_sdk_integration(self, mock_client_cls):
        mock_client = MagicMock()
        mock_response = MagicMock()
        mock_response.text = "Google GenAI SDK response for photosynthesis."
        mock_client.models.generate_content.return_value = mock_response
        mock_client_cls.return_value = mock_client

        res = query_gemini_tutor_structured("Explain photosynthesis", "STEM & Sciences", "Beginner")
        self.assertEqual(res["provider"], "gemini")
        self.assertEqual(res["answer"], "Google GenAI SDK response for photosynthesis.")

    def test_openai_tutor_helper(self):
        res = query_openai_tutor("What is gravity?", "STEM & Sciences", "Beginner")
        self.assertIn("[OpenAI GPT-4o]", res)
        self.assertIn("What is gravity?", res)


if __name__ == "__main__":
    unittest.main()
