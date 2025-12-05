import re
import pytest

from backend.app.usage.utils import calculate_credits_used, calculate_tokens
import pytest

BASE_MODEL_RATE = 40 
CHARS_PER_TOKEN = 4

class TestCalculateTokens:
    """Test suite for calculate_tokens function."""

    def test_empty_string(self):
        """Should return 0 tokens for an empty string."""
        result = calculate_tokens("")
        expected = 0
        assert result == expected

    def test_only_letters(self):
        """Should count letters correctly."""
        result = calculate_tokens("hello world")
        expected = (5 + 5) / CHARS_PER_TOKEN
        assert result == expected

    def test_apostrophes_counted(self):
        """Should count apostrophes as part of words."""
        result = calculate_tokens("don't")
        expected = 5 / CHARS_PER_TOKEN
        assert result == expected

    def test_hyphens_counted(self):
        """Should count hyphens as part of words."""
        result = calculate_tokens("well-done")
        expected = 9 / CHARS_PER_TOKEN
        assert result == expected

    def test_digits_ignored(self):
        """Digits should not count as word characters."""
        result = calculate_tokens("test123")
        expected = 4 / CHARS_PER_TOKEN
        assert result == expected

    def test_special_characters_ignored(self):
        """Special characters should not count as word characters."""
        result = calculate_tokens("hello!!!")
        expected = 5 / CHARS_PER_TOKEN
        assert result == expected

    def test_spaces_ignored(self):
        """Spaces should not affect token calculation."""
        result = calculate_tokens("hello world")
        expected = calculate_tokens("helloworld")
        assert result == expected

    def test_email_address(self):
        """Should count only letters in an email address."""
        result = calculate_tokens("user@email.com")
        expected = 12 / 4
        assert result == expected

    def test_mixed_content(self):
        """Should count letters only in mixed content."""
        result = calculate_tokens("hello123world!!!")
        expected = 10 / CHARS_PER_TOKEN
        assert result == expected

    @pytest.mark.parametrize("message,expected", [
        ("hello", 5 / CHARS_PER_TOKEN),
        ("don't", 5 / CHARS_PER_TOKEN),
        ("well-done", 9 / CHARS_PER_TOKEN),
        ("test!!!", 4 / CHARS_PER_TOKEN),
        ("user@email.com", 12 / CHARS_PER_TOKEN),
    ])
    def test_parametrized_examples(self, message, expected):
        """Parametrized test for multiple examples."""
        result = calculate_tokens(message)
        assert result == expected


class TestCalculateCreditsUsed:
    """Test suite for calculate_credits_used function."""

    def test_minimum_credit(self):
        """Should return 1.00 for very small messages."""
        result = calculate_credits_used("", BASE_MODEL_RATE)
        expected = 1.00
        assert result == expected

        result = calculate_credits_used("Hi", BASE_MODEL_RATE)
        expected = 1.00
        assert result == expected

    def test_exact_token_calculation(self):
        """Should calculate credits based on tokens."""
        message = "a" * 400  # 400 chars → 100 tokens
        result = calculate_credits_used(message, BASE_MODEL_RATE)
        expected = round((100 / 100) * BASE_MODEL_RATE, 2)
        assert result == expected

    def test_credits_above_minimum(self):
        """Should calculate credits correctly for longer messages."""
        message = "a" * 4000  # 4000 chars → 1000 tokens
        result = calculate_credits_used(message, BASE_MODEL_RATE)
        expected = round((1000 / 100) * BASE_MODEL_RATE, 2)
        assert result == expected

    def test_apostrophes_increase_credits(self):
        """Credits should increase with apostrophes."""
        message_with_apostrophe = "don't " * 100  # 5 letters + apostrophe per word
        message_without_apostrophe = "dont " * 100  # 4 letters per word
        result_with = calculate_credits_used(message_with_apostrophe, BASE_MODEL_RATE)
        result_without = calculate_credits_used(message_without_apostrophe, BASE_MODEL_RATE)
        assert result_with > result_without

    def test_hyphens_increase_credits(self):
        """Credits should increase with hyphens."""
        message_with_hyphen = "well-done " * 100  # 8 letters + hyphen
        message_without_hyphen = "well done " * 100  # 8 chars per word
        result_with = calculate_credits_used(message_with_hyphen, BASE_MODEL_RATE)
        result_without = calculate_credits_used(message_without_hyphen, BASE_MODEL_RATE)
        assert result_with > result_without

    def test_digits_ignored(self):
        """Digits should not increase credits."""
        # We need to make these messages longer, because shorter messages will likely end up
        # having less than 1.00 credits used, so it will default to 1.00. Same applies to other
        # test cases.
        result_with_digits = calculate_credits_used("test123 " * 100, BASE_MODEL_RATE)
        result_without_digits = calculate_credits_used("test " * 100, BASE_MODEL_RATE)
        assert result_with_digits == result_without_digits

    def test_special_characters_ignored(self):
        """Special characters should not increase credits."""
        
        result = calculate_credits_used("hello!!!" * 100, BASE_MODEL_RATE)
        expected = calculate_credits_used("hello" * 100, BASE_MODEL_RATE)
        assert result == expected

    def test_spaces_ignored(self):
        """Spaces should not affect credits."""
        result = calculate_credits_used("hello world" * 100, BASE_MODEL_RATE)
        expected = calculate_credits_used("helloworld" * 100, BASE_MODEL_RATE)
        assert result == expected

    def test_email_address(self):
        """Should count letters only in email addresses."""
        result = calculate_credits_used("user@email.com" * 100, BASE_MODEL_RATE)
        expected = round((12 * 100 / CHARS_PER_TOKEN / 100) * BASE_MODEL_RATE, 2)
        assert result == expected

    def test_mixed_content(self):
        """Should handle mixed letters, digits, and special characters."""
        result = calculate_credits_used("hello123world!!!", BASE_MODEL_RATE)
        expected = round((10 / CHARS_PER_TOKEN / 100) * BASE_MODEL_RATE, 2)
        assert result == expected
