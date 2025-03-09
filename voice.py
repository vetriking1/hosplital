import speech_recognition as sr
import pyttsx3
from openai import OpenAI

# Initialize OpenAI client
client = OpenAI(
    base_url="https://openrouter.ai/api/v1",  # Ensure this is the correct API URL
    api_key="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"  # Replace with your actual API key
)

# Initialize text-to-speech engine
engine = pyttsx3.init()

def speak_text(text):
    """Speak the given text using TTS engine."""
    engine.say(text)
    engine.runAndWait()

def capture_audio():
    """Capture audio from the microphone and return the recognized text."""
    recognizer = sr.Recognizer()
    with sr.Microphone() as source:
        print("Please speak now...")
        recognizer.adjust_for_ambient_noise(source)
        try:
            audio = recognizer.listen(source, timeout=5)  # Timeout for better responsiveness
            print("Recognizing...")
            text = recognizer.recognize_google(audio)
            print(f"You said: {text}")
            return text
        except sr.UnknownValueError:
            print("Sorry, I could not understand the audio.")
        except sr.RequestError:
            print("Speech recognition request failed. Check your internet connection.")
        except sr.WaitTimeoutError:
            print("No speech detected. Please try again.")
    return None

def get_hospital_response(query):
    """Get a hospital customer care response from the LLM based on user query."""
    messages = [
        {
            "role": "system",
            "content": (
                "You are a hospital customer care assistant. Your job is to assist patients by providing follow-up "
                "reminders, appointment scheduling, and general hospital-related information in a professional and polite tone."
            ),
        },
        {"role": "user", "content": query}
    ]

    try:
        completion = client.chat.completions.create(
            model="deepseek/deepseek-r1:free",  # Try changing to "gpt-3.5-turbo" if no response
            messages=messages
        )

        if completion and completion.choices:
            return completion.choices[0].message.content
        else:
            return "Sorry, I couldn't process your request at the moment."
    
    except Exception as e:
        print(f"Error calling OpenAI API: {e}")
        return "I'm having trouble connecting to the server. Please try again later."

def predict_from_audio():
    """Capture user voice input, process with LLM, and speak response."""
    query = capture_audio()
    if query:
        response = get_hospital_response(query)
        print(f"Response: {response}")
        speak_text(response)
    else:
        print("No valid audio captured.")

if __name__ == "__main__":
    predict_from_audio()
