# Sneaker Lab

```powershell
& 'D:\Zhone\prototypes\sneaker_lab\Launch.cmd'
```

You can also double-click **Launch.cmd** in that folder. The app uses
Python 3.12 or newer with Tk, Python's desktop window toolkit. The installed
copy includes the image archives and runs offline. The scripts use the Python
standard library and train on the CPU.[^app][^run]

## Run the guided experiment

1. Click **Prepare data**. Wait for the three example photos to appear.
   They show a sandal, a sneaker and an ankle boot.[^data]
2. Click **Go to base training**, then **Train base model**. Compare the
   original image with the grid the model sees. Read down the **Validation
   loss** column to see its prediction error after each training pass.[^fit]
3. Click **Review mistakes**. Use the menu to switch between **False alarms**
   and **Missed sneakers**. Compare the photo, catalog label and model score.
   Click **Label sneaker** or **Label other shoe** to give your own label.
   Use **Next image** to skip an uncertain case.[^app]
4. For the reproducible demo, click **Use 10 of each**, then **Apply rewards**.
   This uses catalog labels for the first ten mistakes of each kind. Any label
   you already supplied takes precedence. The screen shows the rewards and the
   change in validation results.[^app][^fit]
5. Click **Go to fine-tuning**. Leave **Training passes** at **4**, click
   **Fine-tune model**, then **Compare models**. A pass is one visit to every
   example in the current training group.[^fit]
6. Try different **Cutoff** values and compare false alarms with misses.
   For the example below, select **Fine-tuned** and **0.50**, then click
   **Lock and test**. This fixes the choice and opens the final results. Click
   **Open results folder** to find the saved report.[^app][^run]

## What you should see

The default base model flagged **69 false alarms** and **107 missed sneakers**
in the 1,500-image review group. A false positive (false alarm) is a sandal or
boot called a sneaker. A false negative (miss) is a sneaker called another
shoe.[^run][^fit]

The final test contains 1,000 sneakers and 2,000 other shoes. Both rows below
use the same 3,000 images and the same 0.50 cutoff.[^run]

| Model | False alarms | Misses | Precision | Recall | Accuracy |
| --- | ---: | ---: | ---: | ---: | ---: |
| Base | 134 | 204 | 85.6% | 79.6% | 88.7% |
| Fine-tuned | 83 | 179 | 90.8% | 82.1% | 91.3% |

**Precision** answers “Of the shoes called sneakers, how many really were?”
**Recall** answers “Of all the sneakers, how many did we find?” The fine-tuned
model found 821 of the 1,000 sneakers. Always choosing “other shoe” would give
66.7% accuracy while finding zero sneakers.[^fit][^run]

On the verified Windows run, base training took 0.024 s and fine-tuning took
0.189 s. These are elapsed training times. Downloading, preparing images and
waiting for clicks are separate. Timings vary by machine. Your labels, pass
count, model choice and cutoff can change the results.[^run][^fit]

## How the model learns

Zalando's Fashion-MNIST contains 70,000 labeled grayscale clothing images.
This experiment uses all 21,000 images from its three footwear categories.
Each category has 6,000 original training images and 1,000 original test
images. The GUI uses four separate groups from the training archive.[^data]

| Group | Per shoe type | Total | Purpose in this app [^fit] |
| --- | ---: | ---: | --- |
| Base | 100 | 300 | Learn the first weights |
| Review | 500 | 1,500 | Find mistakes and collect feedback |
| Fine-tuning | 4,600 | 13,800 | Supply fresh labeled examples |
| Validation | 800 | 2,400 | Choose a pass, model and cutoff |
| Final test | 1,000 | 3,000 | Score the locked choice and base model |

- **Prepare.** The app checks each compressed file against its SHA-256
  fingerprint. A fixed random seed of 42 repeats the split. Every group keeps
  equal numbers of each shoe type. The regression check compares all 21,000
  images byte for byte to detect exact duplicates across groups.[^fit][^check]
- **Train.** Each 28 × 28 photo becomes 49 average brightness values. The
  model learns one weight per value plus a starting offset. Logistic
  regression turns their weighted sum into a sneaker score between 0 and 1.
  Six passes adjust the weights from labeled examples. The app keeps the pass
  with the lowest validation loss, a measure of prediction error that weighs
  confident mistakes more heavily.[^fit][^linear]
- **Give rewards.** The model tries an answer for each reviewed shoe, sampling
  according to its current score. A match with your label earns +1 and a
  disagreement earns −1. One weight update follows each reward. This is a
  one-step reinforcement learning example. The sampled answer can differ from
  the original base decision shown at cutoff 0.50.[^fit][^reward]
- **Fine-tune.** Training continues from the feedback weights with a smaller
  learning rate, the size of each update. It uses the 13,800 fresh examples
  plus the reviewed labels. The GUI retains all three models for comparison.
  Revisit **Review mistakes** to see their scores on the same photo.[^fit][^app]
- **Evaluate.** A score at or above the cutoff means “sneaker.” Raising the
  cutoff can reduce false alarms and increase misses. Choose using validation
  results. **Lock and test** then decodes the official test images for a final
  measurement.[^fit][^cutoff]

## Use the result

If missing a sneaker is costly, try a lower cutoff on the validation screen
and watch recall. If a false alarm causes extra work, try a higher cutoff and
watch precision and the false-alarm count. Small batches of feedback can
improve one measure while worsening another. Compare the actual counts before
locking a choice.[^cutoff][^fit]

The measurements apply to these centered, low-resolution catalog photos. For a
phone-camera application, collect labeled photos from the intended setting and
reserve a fresh test set before making an accuracy claim.[^data][^split]

**Lock and test** writes a new JSON file under
`D:\Zhone\prototypes\sneaker_lab\runs`. It contains all model weights, the
selected cutoff, data fingerprints, reviewed labels and rewards, training
history, timings and scores. Until that step, progress lives in memory.
**New experiment** starts a fresh run and keeps the earlier report.[^app][^fit]

For expansion, the desktop screens are in [app.py](app.py). Image preparation,
the model and the scoring functions are in [learning.py](learning.py).
The saved weights work with the same 49 brightness values in row order and
the constant offset input used during training.[^fit]

### Check the installation

On a fresh copy, complete **Prepare data** once before this offline check.

```powershell
Set-Location 'D:\Zhone\prototypes\sneaker_lab'
py -3 -B -m unittest -v test_workflow
```

Expect five passing tests and `OK`. The checks exercise the offline GUI,
download recovery, duplicate images, training reproducibility, reward
direction and cutoff behavior.[^check]

If **Prepare data** reports a download failure, restore the connection and
click it again. For an offline installation, copy the four original
`.gz` archives into the app's `data` folder. Keep their published filenames
and compressed form. The next preparation verifies them. The dataset license
ships alongside them.[^data][^fit]

[^data]: [Zalando dataset and archive checksums][data], [dataset paper][paper]
    and the [included MIT license](data/FASHION-MNIST-LICENSE.txt).
[^app]: The controls and run sequence are implemented in [app.py](app.py).
[^fit]: Split sizes, updates, metrics and file handling are implemented in
    [learning.py](learning.py).
[^run]: Measured using the installed GUI on Windows with Python 3.14.3,
    seed 42, ten reviews per error type, four fine-tuning passes and cutoff
    0.50. The installed example is
    `runs/run-20261125-134631-cb2ea383.json`. The review counts come from
    comparing the saved base weights with the fixed review group.
[^check]: [Workflow and data checks](test_workflow.py).
[^linear]: [Logistic regression in the scikit-learn user guide][linear].
[^reward]: [OpenAI Spinning Up, policy-gradient derivation][reward].
[^cutoff]: [scikit-learn, tuning the decision threshold][cutoff].
[^split]: [scikit-learn, data leakage and separate test sets][split].

[data]: https://github.com/zalandoresearch/fashion-mnist
[paper]: https://arxiv.org/abs/1708.07747
[linear]: https://scikit-learn.org/stable/modules/linear_model.html
[reward]: https://spinningup.openai.com/en/latest/spinningup/rl_intro3.html
[cutoff]: https://scikit-learn.org/stable/modules/classification_threshold.html
[split]: https://scikit-learn.org/stable/common_pitfalls.html#data-leakage
