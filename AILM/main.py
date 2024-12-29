import os
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'

# Other imports
from langchain_community.vectorstores import FAISS
from langchain.schema import Document  # Import Document class
from sentence_transformers import SentenceTransformer
from transformers import pipeline
import pandas as pd
import streamlit as st

# Wrapper for SentenceTransformer to match LangChain's expected embedding interface
class LangChainSentenceTransformer:
    def __init__(self, model_name: str):
        self.model = SentenceTransformer(model_name)

    def embed_documents(self, texts):
        return self.model.encode(texts, convert_to_tensor=False)

    def embed_query(self, text):
        return self.model.encode([text], convert_to_tensor=False)[0]

    def __call__(self, text):
        # This makes the class callable and compatible with LangChain's FAISS
        return self.embed_query(text)

def main():
    st.set_page_config(page_title="Ask your CSV")
    st.header("Ask your CSV 📈")

    # Upload CSV file
    csv_file = st.file_uploader("Upload a CSV file", type="csv")
    if csv_file is not None:
        # Load CSV content using pandas
        df = pd.read_csv(csv_file)
        st.write("CSV Data Preview:")
        st.dataframe(df.head())

        # Convert rows of the DataFrame into Document objects
        documents = [Document(page_content=row.to_string()) for _, row in df.iterrows()]

        # Set up embeddings and FAISS vector store
        st.write("Setting up the vector store...")
        embeddings_model = LangChainSentenceTransformer('all-MiniLM-L6-v2')  # Wrapped model
        vector_store = FAISS.from_documents(documents, embeddings_model)

        # Set up the Hugging Face QA pipeline
        qa_pipeline = pipeline('question-answering', model='distilbert-base-uncased-distilled-squad')

        # Accept user question
        user_question = st.text_input("Ask a question about your CSV:")

        if user_question:
            with st.spinner(text="Processing your question..."):
                # Perform similarity search
                relevant_docs = vector_store.similarity_search(user_question, k=3)
                context = " ".join([doc.page_content for doc in relevant_docs])
                
                # Get the answer using the Hugging Face QA pipeline
                result = qa_pipeline(question=user_question, context=context)
                answer = result['answer']

                # Display the answer
                st.write("Answer:")
                st.write(answer)


if __name__ == "__main__":
    main()
