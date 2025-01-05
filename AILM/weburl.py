
import streamlit as st
from dotenv import load_dotenv
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.embeddings import OpenAIEmbeddings, HuggingFaceEmbeddings
from langchain.vectorstores import FAISS
from langchain.chat_models import ChatOpenAI
from langchain.llms import HuggingFaceHub
from langchain.memory import ConversationBufferMemory
from langchain.chains import ConversationalRetrievalChain
from langchain.document_loaders import WebBaseLoader
from htmlT import css, bot_template, user_template
# Load environment variables
load_dotenv()

# CSS Styling

# Function to process website text and create vectorstore
def get_vectorstore_from_url(url, use_openai=False):
    loader = WebBaseLoader(url)
    documents = loader.load()
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    document_chunks = text_splitter.split_documents(documents)
    embeddings = OpenAIEmbeddings() if use_openai else HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
    return FAISS.from_documents(document_chunks, embedding=embeddings)

# Function to create a conversational chain
def get_conversation_chain(vectorstore, use_openai=False):
    llm = ChatOpenAI() if use_openai else HuggingFaceHub(
        repo_id="google/flan-t5-base",
        model_kwargs={"temperature": 0.5, "max_length": 512}
    )
    memory = ConversationBufferMemory(memory_key="chat_history", return_messages=True)
    return ConversationalRetrievalChain.from_llm(
        llm=llm,
        retriever=vectorstore.as_retriever(),
        memory=memory
    )

# Function to handle user input
def handle_user_input(user_question):
    response = st.session_state.conversation({"question": user_question})
    st.session_state.chat_history = response["chat_history"]

    for i, message in enumerate(st.session_state.chat_history):
        if i % 2 == 0:
            st.markdown(user_template.replace("{{MSG}}", message.content), unsafe_allow_html=True)
        else:
            st.markdown(bot_template.replace("{{MSG}}", message.content), unsafe_allow_html=True)

# Main app
def main():
    st.set_page_config(page_title="Chat with Websites", page_icon=":robot:")
    st.write(css, unsafe_allow_html=True)  # Inject CSS styling
    st.title("Chat with Websites :robot:")

    if "conversation" not in st.session_state:
        st.session_state.conversation = None
    if "chat_history" not in st.session_state:
        st.session_state.chat_history = []

    # Sidebar for settings
    with st.sidebar:
        st.header("Settings")
        use_openai = st.checkbox("Use OpenAI for processing", value=False)
        website_url = st.text_input("Enter Website URL")

        if st.button("Process Website"):
            if website_url:
                with st.spinner("Processing website..."):
                    vectorstore = get_vectorstore_from_url(website_url, use_openai=use_openai)
                    st.session_state.conversation = get_conversation_chain(vectorstore, use_openai=use_openai)
            else:
                st.warning("Please enter a valid URL.")

    # Main chat interface
    user_question = st.text_input("Ask your question:")
    if user_question and st.session_state.conversation:
        handle_user_input(user_question)

if __name__ == "__main__":
    main()
