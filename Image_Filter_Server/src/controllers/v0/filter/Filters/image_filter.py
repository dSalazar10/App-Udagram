import sys
import cv2

failed = False

def process():
    # Get the argument variables
    dir_path = sys.argv[1]
    file_name = sys.argv[2]

    # Load the image from disk
    img = cv2.imread(dir_path + file_name, 0)
    if img is None:
        return False, "Image Failed to Load"

    # Apply the Canny edge detection filter
    filtered = cv2.Canny(img, 50, 50)
    if filtered is None:
        return False, "Image Failed To Filter"

    # Write the image back to disk
    out = cv2.imwrite(dir_path + 'filtered.' + file_name, filtered)
    if not out:
        return False, "Image Failed To Write"

    return True, "Success"


isSuccess, message = process()
print(isSuccess)
print(message)
sys.stdout.flush()
