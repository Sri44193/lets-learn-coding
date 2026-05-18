# Python to AI Engineer Roadmap

## Assumptions

- **Current experience:** Absolute beginner
- **Time commitment:** 10 hours per week
- **Timeline goal:** 6 months / 24 weeks

If you have more time, compress the roadmap by completing two weeks of work per week. If you have less time, stretch each week into two weeks.

## Phase 1: Python Fundamentals

### Week 1: Setup and First Python Programs

**Topics to master**

- Installing Python, VS Code, and Jupyter
- Variables and basic data types
- Input and output
- Numbers, strings, booleans
- Basic operators

**Mini-projects**

- Calculator CLI
- Unit converter for kilometers/miles and Celsius/Fahrenheit

**Free resources**

- [Python Official Tutorial](https://docs.python.org/3/tutorial/)
- [Automate the Boring Stuff with Python](https://automatetheboringstuff.com/)
- freeCodeCamp Python beginner videos

### Week 2: Control Flow

**Topics to master**

- `if`, `elif`, and `else`
- `for` and `while` loops
- `break` and `continue`
- Basic problem solving

**Mini-projects**

- Number guessing game
- Rock-paper-scissors game

**Free resources**

- Python Official Tutorial
- HackerRank Python practice
- LeetCode easy problems on conditions and loops

### Week 3: Core Data Structures

**Topics to master**

- Lists, tuples, sets, and dictionaries
- Indexing and slicing
- List and dictionary comprehensions
- Common collection methods

**Mini-projects**

- Contact book using dictionaries
- Word frequency counter

**Free resources**

- [Python Data Structures Documentation](https://docs.python.org/3/tutorial/datastructures.html)
- Corey Schafer Python basics playlist

### Week 4: Functions and Modules

**Topics to master**

- Defining functions
- Parameters and return values
- Scope
- Importing modules
- Standard library basics: `random`, `math`, `datetime`

**Mini-projects**

- Password generator
- Quiz app with scoring

**Checkpoint**

You should now be able to write small Python scripts without following a tutorial line by line.

## Phase 2: Advanced Python

### Week 5: File Handling and Exceptions

**Topics to master**

- Reading and writing `.txt`, `.csv`, and `.json` files
- `with open(...)`
- `try`, `except`, and `finally`
- Custom error messages

**Mini-projects**

- Expense tracker saved to CSV
- JSON-based todo app

**Free resources**

- [Python File I/O Documentation](https://docs.python.org/3/tutorial/inputoutput.html)
- [Python Exceptions Documentation](https://docs.python.org/3/tutorial/errors.html)

### Week 6: Object-Oriented Programming

**Topics to master**

- Classes and objects
- `__init__`
- Instance and class variables
- Inheritance
- Encapsulation
- `__str__` and `__repr__`

**Mini-projects**

- Bank account system
- Library management system

**Practice**

- Model real-world entities such as `Student`, `Course`, `Cart`, and `Product`.

### Week 7: Iterators, Generators, and Decorators

**Topics to master**

- Iterables versus iterators
- `yield`
- Generator expressions
- Decorators
- Higher-order functions

**Mini-projects**

- Execution-time logging decorator
- Generator that streams large file lines

**Free resources**

- Real Python articles on decorators and generators
- Python official iterator documentation

### Week 8: Async, Threads, Testing, and Packaging

**Topics to master**

- `threading`
- `asyncio`
- `pytest`
- Virtual environments
- `pip` and `requirements.txt`
- Basic project structure

**Mini-projects**

- Concurrent URL status checker
- Add tests and packaging structure to one earlier app

**Checkpoint**

You should now understand enough Python to enter data science and AI seriously.

## Phase 3: Data Science Foundations

### Week 9: NumPy

**Topics to master**

- Arrays
- Vectorization
- Broadcasting
- Matrix operations
- Random number generation

**Mini-projects**

- Implement vectorized mean, variance, and normalization
- Simulate dice rolls or stock price movement

**Free resources**

- [NumPy Documentation](https://numpy.org/doc/stable/)
- [NumPy Learn](https://numpy.org/learn/)

### Week 10: Pandas Basics

**Topics to master**

- Series and DataFrames
- Reading CSV, Excel, and JSON files
- Filtering, sorting, and grouping
- Missing values

**Mini-projects**

- Analyze a movie, music, or sales dataset
- Clean a messy CSV dataset

**Free resources**

- [pandas Getting Started](https://pandas.pydata.org/docs/getting_started/)
- Kaggle Learn: Pandas

### Week 11: Data Visualization

**Topics to master**

- Matplotlib
- Seaborn
- Histograms, bar plots, and scatter plots
- Correlation heatmaps
- Choosing the right chart

**Mini-projects**

- Exploratory data analysis notebook
- Dashboard-style report for a public dataset

**Free resources**

- [Matplotlib Tutorials](https://matplotlib.org/stable/tutorials/index)
- Seaborn official gallery

### Week 12: EDA Capstone

**Topics to master**

- Data cleaning
- Feature exploration
- Outlier detection
- Writing insights

**Mini-projects**

- Full EDA on Titanic, Netflix, housing, or health data
- Publish the notebook on GitHub with a clear README

**Checkpoint**

You should be comfortable loading data, cleaning it, plotting it, and explaining patterns.

## Phase 4: Classical Machine Learning and Frameworks

### Week 13: Math for Machine Learning

**Topics to master**

- Vectors and matrices
- Dot products
- Mean, variance, and standard deviation
- Probability basics
- Train/test split intuition

**Mini-projects**

- Implement linear regression from scratch with NumPy
- Visualize gradient descent

**Free resources**

- 3Blue1Brown: Linear Algebra
- Khan Academy: statistics and probability
- StatQuest YouTube

### Week 14: Scikit-Learn Basics

**Topics to master**

- Machine learning workflow
- Regression versus classification
- Train/test split
- Metrics: MAE, RMSE, accuracy, precision, recall, F1
- Pipelines

**Mini-projects**

- House price prediction
- Iris classification

**Free resources**

- [scikit-learn User Guide](https://sklearn.org/stable/)
- [scikit-learn Tutorials](https://scikit-learn.org/stable/tutorial/index.html)

### Week 15: Core Machine Learning Algorithms

**Topics to master**

- Linear regression
- Logistic regression
- Decision trees
- Random forests
- k-nearest neighbors
- Naive Bayes

**Mini-projects**

- Customer churn classifier
- Spam detector

### Week 16: Model Evaluation and Feature Engineering

**Topics to master**

- Cross-validation
- Overfitting and underfitting
- Regularization
- Scaling
- Encoding categorical variables
- Hyperparameter tuning

**Mini-projects**

- End-to-end ML pipeline with `Pipeline` and `GridSearchCV`
- Compare four models on one dataset

**Checkpoint**

You should now be able to build clean classical ML projects.

## Phase 5: Deep Learning Frameworks

Use **PyTorch** for this roadmap. It is widely used in research, easier to debug, Pythonic, and strongly aligned with modern deep learning and Hugging Face workflows.

### Week 17: Neural Network Foundations

**Topics to master**

- Tensors
- Gradients
- Loss functions
- Optimizers
- Backpropagation intuition

**Mini-projects**

- Tiny neural network from scratch with NumPy
- Simple classifier for synthetic data

**Free resources**

- [PyTorch Learn the Basics](https://docs.pytorch.org/tutorials/beginner/basics/)
- [PyTorch Tutorials](https://docs.pytorch.org/tutorials/)

### Week 18: PyTorch Basics

**Topics to master**

- `torch.Tensor`
- `Dataset` and `DataLoader`
- `nn.Module`
- Training loop
- Evaluation loop

**Mini-projects**

- MNIST digit classifier
- Binary classifier with tabular data

### Week 19: Computer Vision

**Topics to master**

- CNNs
- Convolutions and pooling
- Image transforms
- Transfer learning

**Mini-projects**

- Cats versus dogs classifier
- Fine-tune ResNet on a small image dataset

**Free resources**

- PyTorch computer vision tutorials
- torchvision documentation

### Week 20: NLP and Sequence Models

**Topics to master**

- Tokenization
- Embeddings
- RNN/LSTM basics
- Transformer intuition
- Text classification

**Mini-projects**

- Sentiment classifier
- News category classifier

**Checkpoint**

You should understand how deep learning training loops work, not just how to call a model.

## Phase 6: Modern AI and GenAI Frameworks

### Week 21: Hugging Face Transformers

**Topics to master**

- Transformer architecture overview
- Tokenizers
- Pipelines
- Pretrained models
- Fine-tuning basics

**Mini-projects**

- Sentiment analysis using a pretrained model
- Text summarizer with a Hugging Face pipeline

**Free resources**

- [Hugging Face Transformers Documentation](https://huggingface.co/docs/transformers)
- [Hugging Face Course](https://huggingface.co/learn)

### Week 22: Fine-Tuning and Embeddings

**Topics to master**

- Embeddings
- Semantic search
- Vector similarity
- Fine-tuning small models
- Evaluation

**Mini-projects**

- Semantic search over your notes or PDFs
- Fine-tune a classifier on a custom dataset

**Free resources**

- Hugging Face Datasets documentation
- Sentence Transformers documentation

### Week 23: LLM APIs and RAG

**Topics to master**

- Calling LLM APIs
- Prompt engineering
- Retrieval-Augmented Generation
- Chunking
- Vector databases
- Evaluation basics

**Mini-projects**

- Chat with your PDFs/documents
- RAG chatbot over a small knowledge base

**Free resources**

- [LlamaIndex Documentation](https://docs.llamaindex.ai/)
- [LangChain Documentation](https://docs.langchain.com/)
- Official API documentation for your chosen LLM provider

### Week 24: GenAI Capstone

**Topics to master**

- App architecture
- Model selection
- API cost awareness
- Latency
- Guardrails
- Deployment basics

**Capstone options**

- AI research assistant with RAG
- Resume/job matching assistant
- Customer support chatbot
- AI code explainer
- Multimodal image/text demo

**Deliverable**

- Clean GitHub repository
- Setup instructions
- Screenshots or demo video
- Architecture diagram
- Limitations and future improvements

## Weekly Study Structure

For 10 hours per week:

- **3 hours:** Learn concepts
- **4 hours:** Code projects
- **1 hour:** Practice problems
- **1 hour:** Debug and refactor old code
- **1 hour:** Write notes or README summaries

Writing matters. If you can explain a concept clearly, you are much closer to actually owning it.

## Debugging Best Practices

Use this loop:

1. Read the error from bottom to top.
2. Identify the exact file and line number.
3. Print or inspect variable values.
4. Reproduce the bug with the smallest possible input.
5. Search official docs before random blog posts.
6. Use breakpoints in VS Code or `pdb`.
7. Write a failing test, then fix the bug.

Tools to learn:

- `print()` debugging
- VS Code debugger
- `pytest`
- `logging`
- Jupyter cell-by-cell inspection

## Code Quality Best Practices

Follow these habits:

- Use PEP 8 naming and formatting
- Use meaningful variable names
- Keep functions small
- Avoid repeating logic
- Add type hints once you know the basics
- Use virtual environments
- Store dependencies in `requirements.txt` or `pyproject.toml`
- Never commit secrets or API keys
- Format with `black`
- Lint with `ruff`

Useful resources:

- [PEP 8](https://peps.python.org/pep-0008/)
- [pytest Documentation](https://docs.pytest.org/)
- [ruff Documentation](https://docs.astral.sh/ruff/)

## GitHub AI Portfolio Structure

Aim for 6 to 8 strong repositories instead of many shallow notebooks.

Recommended portfolio:

1. `python-mini-projects`
2. `data-analysis-eda`
3. `classical-ml-projects`
4. `deep-learning-pytorch`
5. `nlp-transformers`
6. `rag-llm-assistant`

Each serious repository should include:

- `README.md`
- `requirements.txt`
- `src/`
- `notebooks/` when useful
- `data/` or data download instructions
- `tests/` for serious projects
- Screenshots or demo GIF
- A "What I learned" section

The best final capstone is a RAG-based AI assistant deployed with a simple UI using Streamlit, FastAPI, or Gradio. It demonstrates Python, data handling, AI APIs, embeddings, software structure, and product thinking in one project.
