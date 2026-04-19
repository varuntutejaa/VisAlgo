
const ALGO_META = {
  bubble: {
    name: "Bubble Sort",
    tag: "O(n²)",
    desc: "Repeatedly compares adjacent elements and swaps them if they're out of order. The largest unsorted element 'bubbles' to its correct position each pass.",
    best: "O(n)", avg: "O(n²)", worst: "O(n²)", space: "O(1)", stable: true,
    howto: "Walk through the array from left to right. Compare each pair of adjacent elements. If the left one is bigger, swap them. After each full pass, the largest unsorted element is in place. Repeat until no swaps occur.",
    when: "Mainly used for teaching. It's the most intuitive sorting algorithm. Only practical on very small arrays (< 10 elements) or nearly sorted data where it can exit early.",
    prop: "Stable sort — equal elements maintain their original relative order. With an early-exit optimization, it achieves O(n) on already-sorted input."
  },
  selection: {
    name: "Selection Sort",
    tag: "O(n²)",
    desc: "Finds the minimum element in the unsorted portion and places it at the beginning. Divides the array into growing sorted and shrinking unsorted sections.",
    best: "O(n²)", avg: "O(n²)", worst: "O(n²)", space: "O(1)", stable: false,
    howto: "Scan the entire unsorted portion to find the minimum element. Swap it with the first unsorted position. Move the sorted/unsorted boundary one step right. Repeat until the array is fully sorted.",
    when: "Useful when the cost of writing to memory is very high (e.g., flash storage), since it performs at most n−1 swaps regardless of input. Otherwise, insertion sort is usually better.",
    prop: "Not stable — swapping can move equal elements out of their original relative order. Always performs exactly O(n²) comparisons, no matter the input."
  },
  insertion: {
    name: "Insertion Sort",
    tag: "O(n²)",
    desc: "Builds a sorted subarray one element at a time by inserting each new element into its correct position among the already-sorted elements — like sorting playing cards.",
    best: "O(n)", avg: "O(n²)", worst: "O(n²)", space: "O(1)", stable: true,
    howto: "Start with the second element. Compare it against the sorted portion to its left, shifting elements right until you find its correct spot. Insert it there. Move on to the next element.",
    when: "Excellent for small arrays (< 20 elements) or nearly-sorted data. Used inside Timsort (Python, Java) for small partitions. Much faster in practice than bubble or selection sort for real-world inputs.",
    prop: "Adaptive — runs in O(n) time on nearly sorted data. Online algorithm — can sort elements as they arrive without seeing the full array first."
  },
  merge: {
    name: "Merge Sort",
    tag: "O(n log n)",
    desc: "Recursively splits the array in half, sorts each half independently, then merges the two sorted halves into one — a classic divide-and-conquer algorithm.",
    best: "O(n log n)", avg: "O(n log n)", worst: "O(n log n)", space: "O(n)", stable: true,
    howto: "Split the array down the middle. Recursively sort the left half and the right half. Then merge them: repeatedly pick the smaller front element from each half and place it in the output. Continue until both halves are consumed.",
    when: "Ideal when stability matters or when you're sorting linked lists. Preferred for external sorting (data too large for memory). Java's Collections.sort() uses a merge sort variant (Timsort).",
    prop: "Guaranteed O(n log n) in all cases — no bad inputs. Stable. Requires O(n) extra memory for the temporary merge buffer."
  },
  quick: {
    name: "Quick Sort",
    tag: "O(n log n)",
    desc: "Picks a pivot element and partitions the array so all elements smaller go left, larger go right. Then recursively sorts both sides. Fastest in practice on average.",
    best: "O(n log n)", avg: "O(n log n)", worst: "O(n²)", space: "O(log n)", stable: false,
    howto: "Choose a pivot (here: last element). Walk from both ends inward. Move elements smaller than the pivot to its left, larger to its right. Place the pivot in its final sorted position. Recursively apply to both sub-arrays.",
    when: "The default choice for general-purpose sorting. Used in C's qsort(), V8's Array.sort(), and many standard libraries. Excellent cache performance. Use randomized pivot to avoid worst-case on sorted input.",
    prop: "Not stable. Worst case O(n²) occurs with bad pivot choices on sorted arrays. In practice, with randomized pivots, average performance beats merge sort due to better cache locality."
  },
  heap: {
    name: "Heap Sort",
    tag: "O(n log n)",
    desc: "Transforms the array into a max-heap — a binary tree where each parent exceeds its children. Then repeatedly extracts the maximum to build the sorted result in-place.",
    best: "O(n log n)", avg: "O(n log n)", worst: "O(n log n)", space: "O(1)", stable: false,
    howto: "First, heapify the array (build a max-heap in-place, O(n) time). Then repeatedly swap the root (maximum) with the last element, reduce heap size by one, and restore the heap property by sifting down. Repeat until heap size is 1.",
    when: "Best when you need guaranteed O(n log n) with O(1) extra space — combines the time guarantee of merge sort with the space efficiency of quick sort. Used in real-time and embedded systems. Great for finding the k largest elements.",
    prop: "In-place with O(1) space. Not stable. Guaranteed O(n log n) regardless of input. The heapify phase is O(n), not O(n log n) — a non-obvious but important fact."
  }
};

let array = [];
let isSorting = false;
let stopRequested = false;
let currentAlgo = 'bubble';
const speedMap = { 1: 120, 2: 60, 3: 25, 4: 8, 5: 1 };
const speedLabels = { 1: "Slow", 2: "Normal", 3: "Medium", 4: "Fast", 5: "Blazing" };
let animSpeed = 25;

const barContainer = document.getElementById('bar-container');
const sizeSlider   = document.getElementById('size-slider');
const sizeLabel    = document.getElementById('size-label');
const speedSlider  = document.getElementById('speed-slider');
const speedLabel   = document.getElementById('speed-label');
const btnGenerate  = document.getElementById('btn-generate');
const btnSort      = document.getElementById('btn-sort');
const btnStop      = document.getElementById('btn-stop');
const navAlgoName  = document.getElementById('nav-algo-name');

const coverTag   = document.getElementById('cover-tag');
const coverTitle = document.getElementById('cover-title');
const coverDesc  = document.getElementById('cover-desc');
const badgeBest  = document.getElementById('badge-best');
const badgeAvg   = document.getElementById('badge-avg');
const badgeWorst = document.getElementById('badge-worst');
const badgeSpace = document.getElementById('badge-space');
const badgeStable= document.getElementById('badge-stable');
const coverBadges= document.getElementById('cover-badges');
const infoHowto  = document.getElementById('info-howto');
const infoWhen   = document.getElementById('info-when');
const infoProp   = document.getElementById('info-prop');
const urlParams = new URLSearchParams(window.location.search);
const urlAlgo = urlParams.get('algo');
if (urlAlgo && ALGO_META[urlAlgo]) {
  currentAlgo = urlAlgo;
}

setActiveTab(currentAlgo);
updateCover(currentAlgo);
generateArray();

document.getElementById('algo-tabs').addEventListener('click', e => {
  const tab = e.target.closest('.algo-tab');
  if (!tab || isSorting) return;
  currentAlgo = tab.dataset.algo;
  setActiveTab(currentAlgo);
  updateCover(currentAlgo);
  generateArray();
});

sizeSlider.addEventListener('input', () => {
  sizeLabel.textContent = sizeSlider.value;
  if (!isSorting) generateArray();
});

speedSlider.addEventListener('input', () => {
  animSpeed = speedMap[speedSlider.value];
  speedLabel.textContent = speedLabels[speedSlider.value];
});

btnGenerate.addEventListener('click', () => { if (!isSorting) generateArray(); });

btnSort.addEventListener('click', async () => {
  if (isSorting) return;
  startSorting();
  if (currentAlgo === 'bubble')    await bubbleSort();
  else if (currentAlgo === 'selection') await selectionSort();
  else if (currentAlgo === 'insertion') await insertionSort();
  else if (currentAlgo === 'merge')     await mergeSortWrapper();
  else if (currentAlgo === 'quick')     await quickSortWrapper();
  else if (currentAlgo === 'heap')      await heapSort();
  endSorting();
});

btnStop.addEventListener('click', () => { stopRequested = true; });

function setActiveTab(algo) {
  document.querySelectorAll('.algo-tab').forEach(t => {
    t.classList.toggle('active', t.dataset.algo === algo);
  });
  navAlgoName.textContent = ALGO_META[algo].name;
}

function updateCover(algo) {
  const m = ALGO_META[algo];
  coverTag.textContent   = m.tag;
  coverTitle.textContent = m.name;
  coverDesc.textContent  = m.desc;
  badgeBest.textContent  = m.best;
  badgeAvg.textContent   = m.avg;
  badgeWorst.textContent = m.worst;
  badgeSpace.textContent = m.space;
  badgeStable.textContent= m.stable ? 'Stable' : 'Unstable';
  coverBadges.classList.toggle('unstable', !m.stable);
  infoHowto.textContent  = m.howto;
  infoWhen.textContent   = m.when;
  infoProp.textContent   = m.prop;
}

function generateArray() {
  const size = parseInt(sizeSlider.value);
  array = Array.from({ length: size }, () => Math.floor(Math.random() * 88) + 10);
  renderBars();
}

function renderBars(highlights = {}) {
  barContainer.innerHTML = '';
  array.forEach((val, i) => {
    const bar = document.createElement('div');
    bar.className = 'bar' + (highlights[i] ? ` ${highlights[i]}` : '');
    bar.style.height = `${val}%`;
    barContainer.appendChild(bar);
  });
}

function getBars() { return barContainer.querySelectorAll('.bar'); }

function setBarState(i, state) {
  const bars = getBars();
  if (bars[i]) { bars[i].className = 'bar'; if (state) bars[i].classList.add(state); }
}

function updateBarHeight(i, val) {
  const bars = getBars();
  if (bars[i]) bars[i].style.height = `${val}%`;
}

function markSorted(...indices) {
  const bars = getBars();
  indices.forEach(i => { if (bars[i]) bars[i].className = 'bar sorted'; });
}

function markAllSorted() {
  getBars().forEach(b => b.className = 'bar sorted');
}

function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

async function highlight(indices, type, ms) {
  const bars = getBars();
  indices.forEach(i => { if (bars[i]) { bars[i].className = 'bar'; bars[i].classList.add(type); } });
  await delay(ms);
}

function startSorting() {
  isSorting = true; stopRequested = false;
  btnSort.disabled = true; btnGenerate.disabled = true;
  btnStop.disabled = false; sizeSlider.disabled = true;
  document.querySelectorAll('.algo-tab').forEach(t => t.disabled = true);
}

function endSorting() {
  if (!stopRequested) markAllSorted();
  isSorting = false;
  btnSort.disabled = false; btnGenerate.disabled = false;
  btnStop.disabled = true; sizeSlider.disabled = false;
  document.querySelectorAll('.algo-tab').forEach(t => t.disabled = false);
}

async function bubbleSort() {
  const n = array.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (stopRequested) return;
      await highlight([j, j+1], 'comparing', animSpeed);
      if (array[j] > array[j+1]) {
        [array[j], array[j+1]] = [array[j+1], array[j]];
        updateBarHeight(j, array[j]);
        updateBarHeight(j+1, array[j+1]);
        await highlight([j, j+1], 'swapping', animSpeed);
      }
      setBarState(j, null); setBarState(j+1, null);
    }
    markSorted(n - i - 1);
  }
  markSorted(0);
}

async function selectionSort() {
  const n = array.length;
  for (let i = 0; i < n - 1; i++) {
    if (stopRequested) return;
    let minIdx = i;
    setBarState(i, 'comparing');
    for (let j = i + 1; j < n; j++) {
      if (stopRequested) return;
      setBarState(j, 'comparing');
      await delay(animSpeed);
      if (array[j] < array[minIdx]) {
        if (minIdx !== i) setBarState(minIdx, null);
        minIdx = j;
      } else { setBarState(j, null); }
    }
    if (minIdx !== i) {
      setBarState(minIdx, 'swapping'); setBarState(i, 'swapping');
      await delay(animSpeed * 2);
      [array[i], array[minIdx]] = [array[minIdx], array[i]];
      updateBarHeight(i, array[i]); updateBarHeight(minIdx, array[minIdx]);
      setBarState(minIdx, null);
    }
    markSorted(i);
  }
  markSorted(n - 1);
}

async function insertionSort() {
  const n = array.length;
  markSorted(0);
  for (let i = 1; i < n; i++) {
    if (stopRequested) return;
    let key = array[i], j = i - 1;
    setBarState(i, 'comparing');
    await delay(animSpeed);
    while (j >= 0 && array[j] > key) {
      if (stopRequested) return;
      setBarState(j, 'swapping');
      array[j+1] = array[j];
      updateBarHeight(j+1, array[j+1]);
      await delay(animSpeed);
      setBarState(j+1, null); j--;
    }
    array[j+1] = key;
    updateBarHeight(j+1, key);
    markSorted(...Array.from({length: i+1}, (_, k) => k));
  }
}

async function mergeSortWrapper() { await mergeSort(0, array.length - 1); }

async function mergeSort(l, r) {
  if (stopRequested || l >= r) return;
  const mid = Math.floor((l + r) / 2);
  await mergeSort(l, mid);
  await mergeSort(mid + 1, r);
  await merge(l, mid, r);
}

async function merge(l, mid, r) {
  const left = array.slice(l, mid + 1), right = array.slice(mid + 1, r + 1);
  let i = 0, j = 0, k = l;
  while (i < left.length && j < right.length) {
    if (stopRequested) return;
    setBarState(k, 'comparing'); await delay(animSpeed);
    array[k] = left[i] <= right[j] ? left[i++] : right[j++];
    updateBarHeight(k, array[k]);
    setBarState(k, 'swapping'); await delay(animSpeed);
    setBarState(k, null); k++;
  }
  while (i < left.length) {
    if (stopRequested) return;
    array[k] = left[i++]; updateBarHeight(k, array[k]);
    setBarState(k, 'swapping'); await delay(animSpeed);
    setBarState(k, null); k++;
  }
  while (j < right.length) {
    if (stopRequested) return;
    array[k] = right[j++]; updateBarHeight(k, array[k]);
    setBarState(k, 'swapping'); await delay(animSpeed);
    setBarState(k, null); k++;
  }
}


async function quickSortWrapper() { await quickSort(0, array.length - 1); }

async function quickSort(low, high) {
  if (stopRequested || low >= high) return;
  const pi = await partition(low, high);
  markSorted(pi);
  await quickSort(low, pi - 1);
  await quickSort(pi + 1, high);
}

async function partition(low, high) {
  const pivot = array[high];
  setBarState(high, 'comparing');
  let i = low - 1;
  for (let j = low; j < high; j++) {
    if (stopRequested) return i + 1;
    setBarState(j, 'comparing'); await delay(animSpeed);
    if (array[j] < pivot) {
      i++;
      setBarState(i, 'swapping'); setBarState(j, 'swapping');
      [array[i], array[j]] = [array[j], array[i]];
      updateBarHeight(i, array[i]); updateBarHeight(j, array[j]);
      await delay(animSpeed); setBarState(i, null);
    }
    setBarState(j, null);
  }
  [array[i+1], array[high]] = [array[high], array[i+1]];
  updateBarHeight(i+1, array[i+1]); updateBarHeight(high, array[high]);
  setBarState(high, null);
  return i + 1;
}

async function heapSort() {
  const n = array.length;
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    if (stopRequested) return;
    await heapify(n, i);
  }
  for (let i = n - 1; i > 0; i--) {
    if (stopRequested) return;
    setBarState(0, 'swapping'); setBarState(i, 'swapping');
    [array[0], array[i]] = [array[i], array[0]];
    updateBarHeight(0, array[0]); updateBarHeight(i, array[i]);
    await delay(animSpeed);
    markSorted(i);
    await heapify(i, 0);
  }
  markSorted(0);
}

async function heapify(n, i) {
  let largest = i, l = 2*i+1, r = 2*i+2;
  if (l < n) { setBarState(l, 'comparing'); await delay(animSpeed); if (array[l] > array[largest]) largest = l; setBarState(l, null); }
  if (r < n) { setBarState(r, 'comparing'); await delay(animSpeed); if (array[r] > array[largest]) largest = r; setBarState(r, null); }
  if (largest !== i) {
    setBarState(i, 'swapping'); setBarState(largest, 'swapping');
    [array[i], array[largest]] = [array[largest], array[i]];
    updateBarHeight(i, array[i]); updateBarHeight(largest, array[largest]);
    await delay(animSpeed); setBarState(i, null); setBarState(largest, null);
    await heapify(n, largest);
  }
}
