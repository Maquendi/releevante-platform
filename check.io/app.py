from kivy.app import App
from kivy.uix.boxlayout import BoxLayout
from kivy.uix.textinput import TextInput
from kivy.uix.button import Button
from kivy.uix.label import Label
from contactless.ntag215writer import start_nfc_writer
from service.contactless_card_service import ContactlessCardService

contactlessService = ContactlessCardService()


class MyAppLayout(BoxLayout):
    def __init__(self, **kwargs):
        super().__init__(orientation="vertical", **kwargs)
        contactlessService.subscribe(self)

        self.text_input1 = TextInput(hint_text="Enter first text")
        self.text_input2 = TextInput(hint_text="Enter second text")
        self.submit_button = Button(text="Submit", on_press=self.submit)
        self.result_label = Label(text="")

        self.add_widget(self.text_input1)
        self.add_widget(self.text_input2)
        self.add_widget(self.submit_button)
        self.add_widget(self.result_label)

    def submit(self, instance):
        text1 = self.text_input1.text
        contactlessService.writeContent(text1)
        self.result_label.text = text1

    def onConnected(self, data: str) -> None:
        print(data)
        self.result_label.text = data


class MyKivyApp(App):

    def build(self):
        return MyAppLayout()


if __name__ == "__main__":

    start_nfc_writer(contactlessService)
    MyKivyApp().run()
